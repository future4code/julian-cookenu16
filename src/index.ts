import express, { Request, Response } from "express";
import { AddressInfo } from "net";

import { IdGenerator } from './service/IdGenerator';
import { UserDatabase } from './data/UserDatabase';
import { Authenticator } from './service/Authenticator';
import { HashManager } from "./service/HashManager";
import { Database } from "./data/Database";

const app = express();

app.use(express.json());

const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});

const idGenerator = new IdGenerator();
const userDb = new UserDatabase();
const authenticator = new Authenticator();
const hashManager = new HashManager();

app.post('/signup', async (req:Request, res:Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      throw new Error('Insert a name');
    }
    if (!email || email.indexOf('@') === -1) {
      throw new Error('Insert a valid email');
    }
    if (!password || password.length < 6) {
      throw new Error('Insert a valid password');
    }
    const id = idGenerator.generateId();
    const hashPassword = await hashManager.hash(id);
    await userDb.createUser(id, name, email, hashPassword);
    const token = authenticator.generateToken({ id });

    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }

  await Database.destroyConnection();
});

app.post('/login', async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;
    if (!email || email.indexOf('@') === -1) {
      throw new Error('Insert a valid email');
    }
    if (!password) {
      throw new Error('Insert a password');
    }
    const user = await userDb.getUserByEmail(email);
    const isPasswordCorrect = await hashManager.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid password');
    }
    const { id } = user;
    const token = authenticator.generateToken({ id });

    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }

  await Database.destroyConnection();
});