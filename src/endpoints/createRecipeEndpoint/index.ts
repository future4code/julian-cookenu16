import { Request, Response } from 'express';
import moment from 'moment';

import { Authenticator } from '../../service/Authenticator';
import { IdGenerator } from '../../service/IdGenerator';
import { RecipeDatabase } from '../../data/RecipeDatabase';

export const createRecipeEndpoint = async (req:Request, res:Response) => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    const authData = authenticator.getData(token);

    const { title, description } = req.body;
    if (!title) {
      throw new Error('Insert a tile for the recipe');
    }
    if (!description) {
      throw new Error('Insert a description for the recipe');
    }
    const idGenerator = new IdGenerator();
    const id = idGenerator.generateId();

    const createdAt = moment().format("YYYY-MM-DD hh:mm:ss");

    const recipeDb = new RecipeDatabase();
    await recipeDb.create(id, title, description, createdAt, authData.id);

    res.status(200).send({ message: 'Success' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}