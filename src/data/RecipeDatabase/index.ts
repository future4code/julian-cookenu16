import { Database } from "../Database";
import dotenv from "dotenv";

dotenv.config();

export class RecipeDatabase extends Database {

  private static TABLE_NAME:string = process.env.TB_RECIPE as string;

  public create = async (id:string, title:string, description:string, createdAt:string, creatorId:string):Promise<void> => {
    const created_at = createdAt;
    const creator_user_id = creatorId;
    await this.getConnection()
    .insert({ id, title, description, created_at, creator_user_id })
    .into(RecipeDatabase.TABLE_NAME);

    await Database.destroyConnection();
  }

  public getById = async (id:string):Promise<any> => {
    const result = await this.getConnection()
    .select('*')
    .from(RecipeDatabase.TABLE_NAME)
    .where({ id });

    await Database.destroyConnection();
    return result[0];
  }
}