import dotenv from 'dotenv';
import { Request, Response } from 'express';

import { HashManager } from '../../service/HashManager';
import { UserDatabase } from '../../data/UserDatabase';
import { Authenticator } from '../../service/Authenticator';
import { RefreshTokenDatabase } from '../../data/RefreshTokenDatabase';
import { Database } from '../../data/Database';

import { InvalidInputError } from '../../errors/InvalidInputError';
import { GenericError } from '../../errors/GenericError';

dotenv.config();

export const loginEndpoint = async (req:Request, res:Response) => {
  try {
    const { email, password, device } = req.body;
    if (!email || email.indexOf('@') === -1) {
      throw new InvalidInputError('Insert a valid email');
    }
    if (!password) {
      throw new InvalidInputError('Insert a password');
    }
    if (!device) {
      throw new InvalidInputError('Insert a device');
    }
    const userDb = new UserDatabase();
    const user = await userDb.getByEmail(email);

    const hashManager = new HashManager();
    const isPasswordCorrect = await hashManager.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new GenericError('Invalid password');
    }
    const { id, role } = user;

    const authenticator = new Authenticator();
    const accessToken = authenticator.generateToken({ id, role }, process.env.ACCESS_TOKEN_EXPIRES_IN as string);
    const refreshToken = authenticator.generateToken({ id, device }, process.env.REFRESH_TOKEN_EXPIRES_IN as string);

    const refreshTokenDb = new RefreshTokenDatabase();
    const refreshTokenFromDb = await refreshTokenDb.getByIdAndDevice(id, device);

    if (refreshTokenFromDb) {
      await refreshTokenDb.deleteByToken(refreshTokenFromDb.token);
    }
    refreshTokenDb.create(refreshToken, device, true, id);

    res.status(200).send({ accessToken, refreshToken });
  } catch (error) {
    res.status(error.statusCode || 400).send({ message: error.message });
  }

  await Database.destroyConnection();
}