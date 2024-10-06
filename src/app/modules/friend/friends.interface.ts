import { Types } from 'mongoose';

export type TFriendRequest = {
  sender: Types.ObjectId; // Use ObjectId type here
  receiver: Types.ObjectId; // Use ObjectId type here
  status?: 'pending' | 'accepted' | 'rejected'; // Optional, defaults to 'pending'
};
