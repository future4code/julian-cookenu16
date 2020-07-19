import dotenv from 'dotenv';
import { Request, Response } from 'express';

import { IdGenerator } from '../../service/IdGenerator';
import { HashManager } from '../../service/HashManager';
import { UserDatabase } from '../../data/UserDatabase';
import { Authenticator } from '../../service/Authenticator';
import { RefreshTokenDatabase } from '../../data/RefreshTokenDatabase';
import { Database } from '../../data/Database';

import { InvalidInputError } from '../../errors/InvalidInputError';

dotenv.config();

export const signupEndpoint = async (req:Request, res:Response) => {
  try {
    const { name, email, password, role, device } = req.body;
    if (!name) {
      throw new InvalidInputError('Insert a name');
    }
    if (!email || email.indexOf('@') === -1) {
      throw new InvalidInputError('Insert a valid email');
    }
    if (!password || password.length < 6) {
      throw new InvalidInputError('Insert a valid password');
    }
    if (!role) {
      throw new InvalidInputError('Insert a role');
    }
    if (!device) {
      throw new InvalidInputError('Insert a device');
    }
    const idGenerator = new IdGenerator();
    const id = idGenerator.generateId();

    const hashManager = new HashManager();
    const hashPassword = await hashManager.hash(password);

    const userDb = new UserDatabase();
    await userDb.create(id, name, email, hashPassword, role);

    const authenticator = new Authenticator();
    const accessToken = authenticator.generateToken({ id, role }, process.env.ACCESS_TOKEN_EXPIRES_IN as string);
    const refreshToken = authenticator.generateToken({ id, device }, process.env.REFRESH_TOKEN_EXPIRES_IN as string);

    const refreshTokenDb = new RefreshTokenDatabase();
    await refreshTokenDb.create(refreshToken, device, true, id);

    res.status(200).send({ accessToken, refreshToken });
  } catch (error) {
    res.status(error.statusCode || 400).send({ message: error.message });
  }

  await Database.destroyConnection();
}