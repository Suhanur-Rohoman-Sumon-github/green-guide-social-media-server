import httpStatus from 'http-status';

import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendRespone';

const createUser = catchAsync(async (req, res) => {
  const userData = req.body;

  const result = await UserServices.creteUserInDB(userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user is created successfully',
    data: result,
  });
});
const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user is retrive successfully',
    data: result,
  });
});
const getMyFriends = catchAsync(async (req, res) => {
  const userId = req.params.userId
  const result = await UserServices.getMyFriendsFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'my friends retrieve successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.createAdminIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created successfully',
    data: result,
  });
});
const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;

  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user  retrieve successfully',
    data: result,
  });
});

export const userControllers = {
  createUser,
  createAdmin,
  getMe,
  getAllUser,
  getMyFriends
};
