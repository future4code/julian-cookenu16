import { Database } from "../Database";
import dotenv from "dotenv";

dotenv.config();

export class UserInteractionManagerDatabase extends Database {

  private static TABLE_NAME:string = process.env.TB_INTERACTION as string;

  public followUser = async (idFollower:string, idToFollow:string):Promise<void> => {
    const follower_user_id = idFollower;
    const to_follow_user_id = idToFollow;
    await this.getConnection()
    .insert({ follower_user_id, to_follow_user_id })
    .into(UserInteractionManagerDatabase.TABLE_NAME);

    await Database.destroyConnection();
  }

  public checkUserIsFollowed = async (idFollower:string, idToUnfollow:string):Promise<boolean> => {
    const follower_user_id = idFollower;
    const to_follow_user_id = idToUnfollow;
    const countMatchs = await this.getConnection()
    .count()
    .from(UserInteractionManagerDatabase.TABLE_NAME)
    .where({ follower_user_id, to_follow_user_id });

    await Database.destroyConnection();
    if (countMatchs) {
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

    await Database.destroyConnection();
  }
}