import { Request, Response } from 'express';

import { Authenticator } from '../../service/Authenticator';
import { UserDatabase } from '../../data/UserDatabase';
import { UserInteractionManagerDatabase } from '../../data/UserInteractionManagerDatabase';
import { Database } from '../../data/Database';

import { NotFoundError } from '../../errors/NotFoundError';
import { GenericError } from '../../errors/GenericError';

export const unfollowUserEndpoint = async (req:Request, res:Response) => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const followerUser = authenticator.getData(token);

    const userDb = new UserDatabase();
    const idToUnfollow = req.body.userToUnfollowId as string;
    const userToUnfollow = await userDb.getById(idToUnfollow);

    if (!userToUnfollow) {
      throw new NotFoundError('User not found');
    }

    const userInteractionManagerDb = new UserInteractionManagerDatabase();
    const isUserFollowed = await userInteractionManagerDb.checkUserIsFollowed(followerUser.id, idToUnfollow);
    
    if (!isUserFollowed) {
      throw new GenericError('This user is not followed');
    }

    await userInteractionManagerDb.unfollowUser(followerUser.id, idToUnfollow);

    res.status(200).send({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(error.statusCode || 400).send({ message: error.message });
  }

  await Database.destroyConnection();
}