import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { userModel } from '../user/user.model';

import config from '../../config';
import AppError from '../../error/AppEroor';
import { createToken } from './auth.utils';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';

const loginUser = async (payload: TLoginUser) => {
  const isUserExists = await userModel.findOne({ email: payload.email });
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }

  const isUserDeleted = await userModel.findOne({ isDeleted: true });

  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'user deleted ');
  }

  const jwtPayload = {
    _id: isUserExists._id,
    userId: isUserExists.id,
    role: isUserExists.role,
    username: isUserExists.username,
    name: isUserExists.name,
    profilePicture: isUserExists.profilePicture,
    email: isUserExists.email,
    currentState:isUserExists.currentState
  };

  const accessToken = createToken(
    jwtPayload,
    config.access_secret_key as string,
    config.JWT_ACCESS_EXPIRES_IN as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.refresh_secret_key as string,
    config.JWT_REFRESH_EXPIRES_IN as string,
  );

  return {
    accessToken,
    refreshToken,
    user: isUserExists,
  };
};
const getRefreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'refresh token is required ');
  }
  const decoded = jwt.verify(
    token,
    config.refresh_secret_key as string,
  ) as JwtPayload;

  const { userId, role } = decoded;
  const user = await userModel.find({ userId });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }

  const isUserDeleted = await userModel.findOne({ isDeleted: true });

  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'user deleted ');
  }
  const jwtPayload = {
    userId,
    role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.access_secret_key as string,
    config.JWT_ACCESS_EXPIRES_IN as string,
  );
  return { accessToken };
};
export const AuthServices = {
  loginUser,
  getRefreshToken,
};
