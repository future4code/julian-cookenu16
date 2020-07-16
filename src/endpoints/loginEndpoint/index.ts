import { Request, Response } from 'express';

import { HashManager } from '../../service/HashManager';
import { UserDatabase } from '../../data/UserDatabase';
import { Authenticator } from '../../service/Authenticator';
import { Database } from '../../data/Database';

export const loginEndpoint = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;
    if (!email || email.indexOf('@') === -1) {
      throw new Error('Insert a valid email');
    }
    if (!password) {
      throw new Error('Insert a password');
    }
    const userDb = new UserDatabase();
    const user = await userDb.getByEmail(email);

    const hashManager = new HashManager();
    const isPasswordCorrect = await hashManager.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid password');
    }
    const { id } = user;

    const authenticator = new Authenticator();
    const token = authenticator.generateToken({ id });

    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }

  await Database.destroyConnection();
}