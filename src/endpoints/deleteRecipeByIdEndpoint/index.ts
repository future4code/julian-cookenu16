import { Request, Response } from 'express';

import { Authenticator } from '../../service/Authenticator';
import { UserDatabase } from '../../data/UserDatabase';
import { RecipeDatabase } from '../../data/RecipeDatabase';
import { Database } from '../../data/Database';

import { NotFoundError } from '../../errors/NotFoundError';
import { GenericError } from '../../errors/GenericError';

export const deleteRecipeByIdEndpoint = async (req:Request, res:Response) => {
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

    const recipeDb = new RecipeDatabase();
    const recipe = await recipeDb.getById(id);
    if (!recipe) {
      throw new NotFoundError('Recipe not found');
    }

    if (authData.role !== 'ADMIN') {
      const isRecipeCreatedByUser = await recipeDb.checkIsFromUser(id, authData.id);
      if (!isRecipeCreatedByUser) {
        throw new GenericError('This recipe is not created by this user');
      }
    }

    await recipeDb.deleteById(id);

    res.status(200).send({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(error.statusCode || 400).send({ message: error.message });
  }

  await Database.destroyConnection();
}