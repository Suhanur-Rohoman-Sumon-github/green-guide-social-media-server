import { userModel } from '../user/user.model';
import { TFriendRequest } from './friends.interface';
import { FriendRequestModel } from './friends.model';

const sendFriendRequestsFromDB = async (payload: TFriendRequest) => {
  const result = FriendRequestModel.create(payload);
  return result;
};
const getMyRequests = async (userId: string) => {
  const incomingRequests = await FriendRequestModel.find({
    receiver: userId,
    status: 'pending',
  }).populate('sender');

  return incomingRequests;
};
const createFriendRequestFromDb = async (userId: string, friendId: string) => {
  await userModel.findByIdAndUpdate(userId, {
    $addToSet: { friends: friendId },
  });

  await FriendRequestModel.findOneAndDelete({
    sender: friendId,
    receiver: userId,
    status: 'pending',
  });
};
const rejectedFriendRequestsFromDB = async (
  userId: string,
  friendId: string,
) => {
    console.log(userId,friendId);
  await FriendRequestModel.deleteOne({
    sender: friendId,
    receiver: userId,
    status: 'pending',
  });
};

export const friendRequestsServices = {
  sendFriendRequestsFromDB,
  getMyRequests,
  createFriendRequestFromDb,
  rejectedFriendRequestsFromDB
};
