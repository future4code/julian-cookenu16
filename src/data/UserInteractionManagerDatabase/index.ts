import dotenv from "dotenv";
import { Database } from "../Database";
import { RecipeDatabase } from "../RecipeDatabase";
import { UserDatabase } from "../UserDatabase";

dotenv.config();

export class UserInteractionManagerDatabase extends Database {

  private static TABLE_NAME:string = process.env.TB_INTERACTION as string;

  public static getTableName = ():string => UserInteractionManagerDatabase.TABLE_NAME;

  public followUser = async (idFollower:string, idToFollow:string):Promise<void> => {
    const follower_user_id = idFollower;
    const to_follow_user_id = idToFollow;
    await this.getConnection()
    .insert({ follower_user_id, to_follow_user_id })
    .into(UserInteractionManagerDatabase.TABLE_NAME);
  }

  public checkUserIsFollowed = async (idFollower:string, idToUnfollow:string):Promise<boolean> => {
    const follower_user_id = idFollower;
    const to_follow_user_id = idToUnfollow;
    const result = await this.getConnection()
    .select('*')
    .from(UserInteractionManagerDatabase.TABLE_NAME)
    .where({ follower_user_id, to_follow_user_id });
    const count:number = result.length;
    if (count) {
      return true;
    }
    return false;
  }

  public unfollowUser = async (idFollower:string, idToUnfollow:string):Promise<void> => {
    const follower_user_id = idFollower;
    const to_follow_user_id = idToUnfollow;
    await this.getConnection()
    .delete()
    .from(UserInteractionManagerDatabase.TABLE_NAME)
    .where({ follower_user_id, to_follow_user_id });
  }

  public getAllFollowers = async (idFollower:string):Promise<any> => {
    const follower_user_id = idFollower;
    const result = await this.getConnection()
    .select('to_follow_user_id as userId')
    .from(UserInteractionManagerDatabase.TABLE_NAME)
    .where({ follower_user_id });
    return result;
  }

  public getFeed = async (idFollower:string):Promise<any> => {
    const result = await this.getConnection().raw(`
      SELECT r.id, r.title, r.description, r.created_at as createdAt, u.id as userId, u.name as userName FROM ${RecipeDatabase.getTableName()} r
      JOIN ${UserInteractionManagerDatabase.TABLE_NAME} uim ON r.creator_user_id = uim.to_follow_user_id
      JOIN ${UserDatabase.getTableName()} u ON u.id = r.creator_user_id
      WHERE uim.follower_user_id = '${idFollower}'
      ORDER BY r.created_at DESC
    `);
    return result[0];
  }

  public deleteInteraction = async (userId:string):Promise<void> => {
    const follower_user_id = userId;
    const to_follow_user_id = userId;
    await this.getConnection()
    .select('*')
    .from(UserInteractionManagerDatabase.TABLE_NAME)
    .delete()
    .where({ follower_user_id })
    .orWhere({ to_follow_user_id });
  }
}