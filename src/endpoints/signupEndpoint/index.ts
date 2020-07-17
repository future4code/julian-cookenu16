import { Request, Response } from 'express';

import { IdGenerator } from '../../service/IdGenerator';
import { HashManager } from '../../service/HashManager';
import { UserDatabase } from '../../data/UserDatabase';
import { Authenticator } from '../../service/Authenticator';

import { InvalidInputError } from '../../errors/InvalidInputError';

export const signupEndpoint = async (req:Request, res:Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      throw new InvalidInputError('Insert a name');
    }
    if (!email || email.indexOf('@') === -1) {
      throw new InvalidInputError('Insert a valid email');
    }
    if (!password || password.length < 6) {
      throw new InvalidInputError('Insert a valid password');
    }
    const idGenerator = new IdGenerator();
    const id = idGenerator.generateId();

    const hashManager = new HashManager();
    const hashPassword = await hashManager.hash(password);

    const userDb = new UserDatabase();
    await userDb.create(id, name, email, hashPassword);

    const authenticator = new Authenticator();
    const token = authenticator.generateToken({ id });

    res.status(200).send({ token });
  } catch (error) {
    res.status(error.statusCode || 400).send({ message: error.message });
  }
}