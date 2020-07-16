import { Request, Response } from 'express';

import { Authenticator } from '../../service/Authenticator';
import { UserDatabase } from '../../data/UserDatabase';
import { UserInteractionManagerDatabase } from '../../data/UserInteractionManagerDatabase';

export const unfollowUserEndpoint = async (req:Request, res:Response) => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const followerUser = authenticator.getData(token);

    const userDb = new UserDatabase();
    const idToUnfollow = req.body.userToUnfollowId as string;
    const userToUnfollow = userDb.getById(idToUnfollow);

    if (!userToUnfollow) {
      throw new Error('Insert a valid user to unfollow');
    }

    const userInteractionManagerDb = new UserInteractionManagerDatabase();
    await userInteractionManagerDb.unfollowUser(followerUser.id, idToUnfollow);

    res.status(200).send({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}