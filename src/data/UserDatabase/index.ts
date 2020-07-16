import { Database } from "../Database";
import dotenv from "dotenv";

dotenv.config();

export class UserDatabase extends Database {

  private static TABLE_NAME:string = process.env.TB_USER as string;

  public create = async (id:string, name:string, email:string, password:string):Promise<void> => {
    try {
      await this.getConnection()
      .insert({ id, name, email, password })
      .into(UserDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public getByEmail = async (email:string):Promise<any> => {
    try {
      const result = await this.getConnection()
      .select('*')
      .from(UserDatabase.TABLE_NAME)
      .where({ email });
      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public getById = async (id:string):Promise<any> => {
    try {
      const result = await this.getConnection()
      .select('*')
      .from(UserDatabase.TABLE_NAME)
      .where({ id });
      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public deleteById = async (id:string):Promise<void> => {
    try {
      await this.getConnection()
      .select('*')
      .from(UserDatabase.TABLE_NAME)
      .delete()
      .where({ id });
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}