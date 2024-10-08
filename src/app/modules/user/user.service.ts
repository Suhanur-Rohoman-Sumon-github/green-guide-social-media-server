import mongoose from 'mongoose';
import { TUser } from './user.interface';
import { userModel } from './user.model';
import { generateAdminId, generateUserId } from './user.utils';
import httpStatus from 'http-status';
import AppError from '../../error/AppEroor';
import { TAdmin } from '../admin/admin.interface';
import { adminModel } from '../admin/admin.model';

const creteUserInDB = async (payload: TUser) => {
  const newUser = payload;
  newUser.id = await generateUserId();
  const result = await userModel.create(newUser);

  return result;
};
const updateProfilePictureInDb = async (userId:string,profilePicture:Express.Multer.File | undefined) => {
  
    if (!profilePicture) {
    throw new Error('No profile picture provided');
  }

  
  const profilePictureUrl = profilePicture.path; 

  
  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    { profilePicture: profilePictureUrl },
    { new: true } 
  );

  if (!updatedUser) {
    throw new Error('User not found');
  }
  return updatedUser

};
const updateCoverPhotoFromDb = async (userId:string,coverPhoto:Express.Multer.File | undefined) => {
  
    if (!coverPhoto) {
    throw new Error('No cover phot given');
  }
  
  const coverPhotoUrl = coverPhoto.path; 
  
  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    { coverPhoto: coverPhotoUrl },
    { new: true } 
  );

  if (!updatedUser) {
    throw new Error('User not found');
  }
  return updatedUser

};
const updateBio = async (userId:string,bio:string) => {
  
  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    { bio: bio },
    { new: true } 
  );

  if (!updatedUser) {
    throw new Error('User not found');
  }
  return updatedUser

};
const unfriendAUserInDB = async (userId: string, friendId: string) => {

  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    { $pull: { friends: friendId } }, 
    { new: true } 
  );

  if (!updatedUser) {
    throw new Error('User not found');
  }

  return updatedUser;
};

// TODO:add user id to removed current user send requests
const getAllUserFromDb = async () => {
  const result = await userModel.find();

  return result;
};
const getMyFriendsFromDB = async (userId:string) => {
  const userWithFriends = await userModel
      .findById(userId)
      .populate('friends', 'name email profilePicture _id') 
      .exec();

    if (!userWithFriends) {
      return { message: "User not found" };
    }

    return userWithFriends.friends;
};
const getMe = async (userId:string) => {

  
   const result = await userModel.findById(userId)
  return result;
};
const createAdminIntoDB = async (payload: TAdmin) => {
  // create a user object
  const userData: Partial<TAdmin> = payload;

  //set student role
  userData.role = 'admin';

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await userModel.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;

    // create a admin (transaction-2)
    const newAdmin = await adminModel.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  creteUserInDB,
  createAdminIntoDB,
  getMe,
  getAllUserFromDb,
  getMyFriendsFromDB,
  updateProfilePictureInDb,
  updateCoverPhotoFromDb,
  updateBio,
  unfriendAUserInDB
};
