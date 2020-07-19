import moment from 'moment';
import { Request, Response } from 'express';

import { Authenticator } from '../../service/Authenticator';
import { UserDatabase } from '../../data/UserDatabase';
import { UserInteractionManagerDatabase } from '../../data/UserInteractionManagerDatabase';
import { Database } from '../../data/Database';

import { NotFoundError } from '../../errors/NotFoundError';

export const getFeedEndpoint = async (req:Request, res:Response) => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const authData = authenticator.getData(token);

    const userDb = new UserDatabase();
    const user = await userDb.getById(authData.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const userInteractionManagerDb = new UserInteractionManagerDatabase();
    const recipesFromDB = await userInteractionManagerDb.getFeed(authData.id);

    const recipes = recipesFromDB.map((item:any) => {
      return { ...item, createdAt: moment(item.createdAt, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY") };
    });

    res.status(200).send({ recipes });
  } catch (error) {
    res.status(error.statusCode || 400).send({ message: error.message });
  }

  await Database.destroyConnection();
}