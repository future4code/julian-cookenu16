import { Request, Response } from 'express';

import { Authenticator } from '../../service/Authenticator';
import { UserDatabase } from '../../data/UserDatabase';

export const getUserByIdEndpoint = async (req:Request, res:Response):Promise<any> => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    authenticator.getData(token);

    const userDb = new UserDatabase();
    const user = await userDb.getById(req.params.id as string);
    const { id, name, email } = user;

    res.status(200).send({ id, name, email });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}