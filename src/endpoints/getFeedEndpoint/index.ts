import moment from 'moment';
import { Request, Response } from 'express';

import { Authenticator } from '../../service/Authenticator';
import { UserDatabase } from '../../data/UserDatabase';
import { UserInteractionManagerDatabase } from '../../data/UserInteractionManagerDatabase';

import { NotFoundError } from '../../errors/NotFoundError';
import { RecipeDatabase } from '../../data/RecipeDatabase';

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
    const usersFollowed = await userInteractionManagerDb.getAllFollowers(authData.id);

    const recipeDb = new RecipeDatabase();
    const recipesFromDB = await recipeDb.getByIdArray(usersFollowed);

    let recipes:any[] = [];
    for (let item of recipesFromDB) {
      const createdAt = moment(item.created_at, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY");
      const user = await userDb.getById(item.creator_user_id);
      const { id, title, description } = item;
      const userId = user.id;
      const userName = user.name;
      const recipe = {
        id,
        title, 
        description,
        createdAt,
        userId,
        userName
      }
      recipes.push(recipe);
    }

    res.status(200).send({ recipes });
  } catch (error) {
    res.status(error.statusCode || 400).send({ message: error.message });
  }
}