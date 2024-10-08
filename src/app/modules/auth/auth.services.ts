import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { userModel } from '../user/user.model';
import bcrypt from 'bcrypt'
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

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
   const isUserExists = await userModel.findOne({ email: userData.email });
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }
  // checking if the user is exist
  

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // checking if the user is blocked

  const userStatus = isUserExists?.status;

  if (userStatus === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  //checking if the password is correct

  if (!(await userModel.isPasswordMatched(payload.oldPassword, isUserExists?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round)
  );

  await userModel.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );

  return null;
};
export const AuthServices = {
  loginUser,
  getRefreshToken,
  changePassword
};
