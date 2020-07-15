import * as jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

interface AuthenticationData {
  id:string;
}

export class Authenticator {
  private static EXPIRES_IN = '1min';

  public generateToken = (input:AuthenticationData):string => {
    const token = jwt.sign(input, process.env.JWT_KEY as string, { expiresIn: Authenticator.EXPIRES_IN });
    return token;
  }

  public getData = (token:string):AuthenticationData => {
    const payload = jwt.verify(token, process.env.JWT_KEY as string) as any;
    return payload;
  }
}