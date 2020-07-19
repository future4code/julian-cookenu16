import dotenv from "dotenv";
import { Database } from "../Database";
import { ROLES } from "../../service/Authenticator";

dotenv.config();

export class UserDatabase extends Database {

  private static TABLE_NAME:string = process.env.TB_USER as string;

  public static getTableName = ():string => UserDatabase.TABLE_NAME;

  public create = async (id:string, name:string, email:string, password:string, role:ROLES):Promise<void> => {
    await this.getConnection()
    .insert({ id, name, email, password, role })
    .into(UserDatabase.TABLE_NAME);
  }

  public getByEmail = async (email:string):Promise<any> => {
    const result = await this.getConnection()
    .select('*')
    .from(UserDatabase.TABLE_NAME)
    .where({ email });
    return result[0];
  }

  public getById = async (id:string):Promise<any> => {
    const result = await this.getConnection()
    .select('*')
    .from(UserDatabase.TABLE_NAME)
    .where({ id });
    return result[0];
  }

  public changeRoleById = async (id:string, role:ROLES):Promise<void> => {
    await this.getConnection()
    .from(UserDatabase.TABLE_NAME)
    .update({ role })
    .where({ id });
  }

  public deleteById = async (id:string):Promise<void> => {
    await this.getConnection()
    .select('*')
    .from(UserDatabase.TABLE_NAME)
    .delete()
    .where({ id });
  }
}