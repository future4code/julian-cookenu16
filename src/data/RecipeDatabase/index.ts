import dotenv from "dotenv";
import { Database } from "../Database";

dotenv.config();

interface Recipe {
  title?:string;
  description?:string;
}

export class RecipeDatabase extends Database {

  private static TABLE_NAME:string = process.env.TB_RECIPE as string;

  public static getTableName = ():string => RecipeDatabase.TABLE_NAME;

  public create = async (id:string, title:string, description:string, createdAt:string, creatorId:string):Promise<void> => {
    const created_at = createdAt;
    const creator_user_id = creatorId;
    await this.getConnection()
    .insert({ id, title, description, created_at, creator_user_id })
    .into(RecipeDatabase.TABLE_NAME);
  }

  public getById = async (id:string):Promise<any> => {
    const result = await this.getConnection()
    .select('id', 'title', 'description', 'created_at as createdAt', 'creator_user_id as creatorUserId')
    .from(RecipeDatabase.TABLE_NAME)
    .where({ id });
    return result[0]
  }

  public getByUsersId = async (usersId:string[]):Promise<any> => {
    const result = await this.getConnection()
    .select('id', 'title', 'description', 'created_at as createdAt', 'creator_user_id as creatorUserId')
    .from(RecipeDatabase.TABLE_NAME)
    .whereIn('creator_user_id', usersId)
    .orderBy('created_at', 'DESC');
    return result;
  }

  public checkIsFromUser = async (recipeId:string, creatorId:string):Promise<boolean> => {
    const id = recipeId;
    const creator_user_id = creatorId;
    const result = await this.getConnection()
    .select('*')
    .from(RecipeDatabase.TABLE_NAME)
    .where({ id, creator_user_id });
    const count:number = result.length;
    if (count) {
      return true;
    }
    return false;
  }

  public editById = async (id:string, recipe:Recipe):Promise<void> => {
    const { title, description } = recipe;
    await this.getConnection()
    .from(RecipeDatabase.TABLE_NAME)
    .update({ title, description })
    .where({ id });
  }

  public deleteById = async (id:string):Promise<void> => {
    await this.getConnection()
    .select('*')
    .from(RecipeDatabase.TABLE_NAME)
    .delete()
    .where({ id });
  }

  public deleteByUserId = async (userId:string):Promise<void> => {
    const creator_user_id = userId;
    await this.getConnection()
    .select('*')
    .from(RecipeDatabase.TABLE_NAME)
    .delete()
    .where({ creator_user_id });
  }
}