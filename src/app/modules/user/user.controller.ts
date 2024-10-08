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
 const userId = req.params.userId
  

  const result = await UserServices.getMe(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user  retrieve successfully',
    data: result,
  });
});
const updateProfilePicture = catchAsync(async (req, res) => {
  const userId = req.params.userId
  const profilePicture = req.file
  

  const result = await UserServices.updateProfilePictureInDb(userId,profilePicture );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user  profile picture updated successfully',
    data: result,
  });
});

const updateCoverPhoto = catchAsync(async (req, res) => {
  const userId = req.params.userId
  const coverPhoto = req.file
  
  

  const result = await UserServices.updateCoverPhotoFromDb(userId,coverPhoto );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user  cover photo updated successfully',
    data: result,
  });
});
const updateBio = catchAsync(async (req, res) => {
  const userId = req.params.userId
  const bio = req.body.bio

  const result = await UserServices.updateBio(userId,bio );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user  profile picture updated successfully',
    data: result,
  });
});
const unfriendUser = catchAsync(async (req, res) => {
  const userId = req.params.userId
 const friendId = req.params.friendId

 console.log(friendId);

  const result = await UserServices.unfriendAUserInDB(userId,friendId );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user  profile picture updated successfully',
    data: result,
  });
});

export const userControllers = {
  createUser,
  createAdmin,
  getMe,
  getAllUser,
  getMyFriends,
  updateProfilePicture,
  updateCoverPhoto,
  updateBio,
  unfriendUser
};
