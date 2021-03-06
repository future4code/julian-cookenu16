import { Request, Response } from 'express';

import { Authenticator } from '../../service/Authenticator';
import { UserDatabase } from '../../data/UserDatabase';
import { Database } from '../../data/Database';

import { NotFoundError } from '../../errors/NotFoundError';

export const getUserByIdEndpoint = async (req:Request, res:Response) => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    authenticator.getData(token);

    const userDb = new UserDatabase();
    const user = await userDb.getById(req.params.id as string);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const { id, name, email } = user;

    res.status(200).send({ id, name, email });
  } catch (error) {
    res.status(error.statusCode || 400).send({ message: error.message });
  }

  await Database.destroyConnection();
}