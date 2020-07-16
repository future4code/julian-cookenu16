import { Database } from "../Database";
import dotenv from "dotenv";

dotenv.config();

export class UserDatabase extends Database {

  private static TABLE_NAME:string = process.env.TB_USER as string;

  public create = async (id:string, name:string, email:string, password:string):Promise<void> => {
    await this.getConnection()
    .insert({ id, name, email, password })
    .into(UserDatabase.TABLE_NAME);

    await Database.destroyConnection();
  }

  public getByEmail = async (email:string):Promise<any> => {
    const result = await this.getConnection()
    .select('*')
    .from(UserDatabase.TABLE_NAME)
    .where({ email });

    await Database.destroyConnection();
    return result[0];
  }

  public getById = async (id:string):Promise<any> => {
    const result = await this.getConnection()
    .select('*')
    .from(UserDatabase.TABLE_NAME)
    .where({ id });

    await Database.destroyConnection();
    return result[0];
  }

  public deleteById = async (id:string):Promise<void> => {
    await this.getConnection()
    .select('*')
    .from(UserDatabase.TABLE_NAME)
    .delete()
    .where({ id });

    await Database.destroyConnection();
  }
}