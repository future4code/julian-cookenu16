import moment from 'moment';
import { Request, Response } from 'express';

import { Authenticator } from '../../service/Authenticator';
import { UserDatabase } from '../../data/UserDatabase';
import { IdGenerator } from '../../service/IdGenerator';
import { RecipeDatabase } from '../../data/RecipeDatabase';
import { Database } from '../../data/Database';

import { NotFoundError } from '../../errors/NotFoundError';
import { InvalidInputError } from '../../errors/InvalidInputError';

export const createRecipeEndpoint = async (req:Request, res:Response) => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const authData = authenticator.getData(token);

    const userDb = new UserDatabase();
    const user = await userDb.getById(authData.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { title, description } = req.body;
    if (!title) {
      throw new InvalidInputError('Insert a tile for the recipe');
    }
    if (!description) {
      throw new InvalidInputError('Insert a description for the recipe');
    }
    const idGenerator = new IdGenerator();
    const id = idGenerator.generateId();

    const createdAt = moment().format("YYYY-MM-DD hh:mm:ss");

    const recipeDb = new RecipeDatabase();
    await recipeDb.create(id, title, description, createdAt, authData.id);

    res.status(200).send({ message: 'Success' });
  } catch (error) {
    res.status(error.statusCode || 400).send({ message: error.message });
  }

  await Database.destroyConnection();
}