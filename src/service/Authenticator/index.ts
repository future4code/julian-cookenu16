import * as jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

interface AuthenticationData {
  id:string;
  role?:ROLES;
  device?:string;
}

export enum ROLES {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN"
}

export class Authenticator {
  public generateToken = (input:AuthenticationData, expiresIn:string):string => {
    const token = jwt.sign(input, process.env.JWT_KEY as string, { expiresIn });
    return token;
  }

  public getData = (token:string):AuthenticationData => {
    const payload = jwt.verify(token, process.env.JWT_KEY as string) as any;
    return payload;
  }
}