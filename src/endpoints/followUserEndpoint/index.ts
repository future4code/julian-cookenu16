import { Request, Response } from 'express';

import { Authenticator } from '../../service/Authenticator';
import { UserDatabase } from '../../data/UserDatabase';
import { UserInteractionManagerDatabase } from '../../data/UserInteractionManagerDatabase';
import { Database } from '../../data/Database';

import { NotFoundError } from '../../errors/NotFoundError';

export const followUserEndpoint = async (req:Request, res:Response) => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const followerUser = authenticator.getData(token);

    const userDb = new UserDatabase();
    const idToFollow = req.body.userToFollowId as string;
    const userToFollow = await userDb.getById(idToFollow);

    if (!userToFollow) {
      throw new NotFoundError('Insert a valid user to follow');
    }

    const userInteractionManagerDb = new UserInteractionManagerDatabase();
    await userInteractionManagerDb.followUser(followerUser.id, idToFollow);

    res.status(200).send({ message: "Followed successfully" });
  } catch (error) {
    res.status(error.statusCode || 400).send({ message: error.message });
  }

  await Database.destroyConnection();
}