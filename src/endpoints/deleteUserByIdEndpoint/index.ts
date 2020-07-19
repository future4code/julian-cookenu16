import { Request, Response } from 'express';

import { Authenticator } from '../../service/Authenticator';
import { UserDatabase } from '../../data/UserDatabase';
import { UserInteractionManagerDatabase } from '../../data/UserInteractionManagerDatabase';
import { RecipeDatabase } from '../../data/RecipeDatabase';
import { Database } from '../../data/Database';

import { NotFoundError } from '../../errors/NotFoundError';
import { ForbidenError } from '../../errors/ForbiddenError';

export const deleteUserByIdEndpoint = async (req:Request, res:Response) => {
  try {
    const token = req.headers.authorization as string;
    const id = req.params.id as string;

    const authenticator = new Authenticator();
    const authData = authenticator.getData(token);

    const userDb = new UserDatabase();
    const user = await userDb.getById(authData.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (authData.role !== 'ADMIN') {
      throw new ForbidenError('User is not authorized to complete this operation')
    }

    const userToBeDeleted = await userDb.getById(id);
    if (!userToBeDeleted) {
      throw new NotFoundError('User to be deleted not found');
    }

    const userInteractionManagerDb = new UserInteractionManagerDatabase();
    await userInteractionManagerDb.deleteInteraction(id);

    const recipeDb = new RecipeDatabase();
    await recipeDb.deleteByUserId(id);

    await userDb.deleteById(id);

    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
  res.status(error.statusCode || 400).send({ message: error.message });
}

await Database.destroyConnection();
}