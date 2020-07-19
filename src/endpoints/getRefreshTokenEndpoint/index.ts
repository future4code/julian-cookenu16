import dotenv from 'dotenv';
import { Request, Response } from 'express';

import { Authenticator } from '../../service/Authenticator';
import { UserDatabase } from '../../data/UserDatabase';
import { Database } from '../../data/Database';

import { InvalidInputError } from '../../errors/InvalidInputError';

dotenv.config();

export const getRefreshTokenEndpoint = async (req:Request, res:Response) => {
  try {
    const { refreshToken, device } = req.body;

    const authenticator = new Authenticator();
    const refreshTokenData = authenticator.getData(refreshToken);

    if (refreshTokenData.device !== device) { 
      throw new InvalidInputError('Refresh token has no device');
    }

    const userDb = new UserDatabase();
    const user = await userDb.getById(refreshTokenData.id);
    const { id } = user.id;

    const accessToken = authenticator.generateToken({ id, device }, process.env.ACCESS_TOKEN_EXPIRES_IN as string);

    res.status(200).send({ accessToken });
  } catch (error) {
    res.status(error.statusCode || 400).send({ message: error.message });
  }

  await Database.destroyConnection();
}