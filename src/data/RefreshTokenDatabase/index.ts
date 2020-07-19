import dotenv from 'dotenv';
import { Database } from "../Database";

dotenv.config();

export class RefreshTokenDatabase extends Database {

  private static TABLE_NAME:string = process.env.TB_REFRESH_TOKEN as string;

  public static getTableName = ():string => RefreshTokenDatabase.TABLE_NAME;

  public create = async (token:string, device:string, isActive:boolean, userId:string):Promise<void> => {
    const refresh_token = token;
    const is_active = isActive ? 1 : 0;
    const user_id = userId;
    await this.getConnection()
    .insert({ refresh_token, device, is_active, user_id })
    .into(RefreshTokenDatabase.TABLE_NAME);
  }

  public getByToken = async (token:string):Promise<any> => {
    const refresh_token = token;
    const result = await this.getConnection()
    .select('refresh_token as token', 'device', 'is_active as isActive', 'user_id as userId')
    .from(RefreshTokenDatabase.TABLE_NAME)
    .where({ refresh_token });

    return { ...result[0], isActive: result[0].isActive ? true : false };
  }

  public getByIdAndDevice = async (id:string, device:string):Promise<any> => {
    const user_id = id;
    const result = await this.getConnection()
    .select('refresh_token as token', 'device', 'is_active as isActive', 'user_id as userId')
    .from(RefreshTokenDatabase.TABLE_NAME)
    .where({ user_id, device });
    if (!result[0]) {
      return undefined;
    }
    return { ...result[0], isActive: result[0].isActive ? true : false };
  }

  public deleteByToken = async (token:string):Promise<void> => {
    const refresh_token = token;
    await this.getConnection()
    .delete()
    .from(RefreshTokenDatabase.TABLE_NAME)
    .where({ refresh_token });
  }
}