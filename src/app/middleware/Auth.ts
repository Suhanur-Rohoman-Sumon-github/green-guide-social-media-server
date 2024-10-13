import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRol } from '../modules/user/user.interface';
import AppError from '../error/AppEroor';
const Auth = (...requiredRoles: TUserRol[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

   

    if (!authHeader ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Unauthorized access detected',
      );
    }

    const token = authHeader
   
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'UnAuthorized access detection ',
      );
    }
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.access_secret_key as string,
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(401, 'UnAuthorized access detection ');
    }
    if (!decoded) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'UnAuthorized access detection ',
      );
    }

    if (!requiredRoles.includes(decoded.role as TUserRol)) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'You have no access to this route',
      });
    }

   

    req.user = decoded;
    next();
  });
};

export default Auth;
