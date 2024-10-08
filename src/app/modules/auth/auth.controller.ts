import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

import config from '../../config';
import sendResponse from '../../utils/sendRespone';
import { AuthServices } from './auth.services';

const loginUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await AuthServices.loginUser(req.body);
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_Env === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  });
});
const getRefreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const results = await AuthServices.getRefreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'access token retrieve successfully',
    data: results,
  });
});


const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated successfully!',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  getRefreshToken,
  changePassword
};
