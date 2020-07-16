import { Request, Response } from 'express';
import moment from 'moment';

import { Authenticator } from '../../service/Authenticator';
import { RecipeDatabase } from '../../data/RecipeDatabase';

export const getRecipeEndpoint = async (req:Request, res:Response):Promise<any> => {
  try {
    const token = req.headers.authorization as string;

    const authenticator = new Authenticator();
    authenticator.getData(token);

    const recipeDb = new RecipeDatabase();
    const recipe = await recipeDb.getById(req.params.id as string);
    const { id, title, description } = recipe;
    const createdAt = moment(recipe.created_at, "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY");

    res.status(200).send({ id, title, description, createdAt });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}