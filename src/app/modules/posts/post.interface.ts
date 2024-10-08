import mongoose, { ObjectId, Types } from 'mongoose';
import { TUser } from '../user/user.interface';

export type TComment = {
  user: ObjectId;
  content: string;
  createdAt?: Date;
};

export type TShare = {
  user: Types.ObjectId | TUser;
  sharedPostId: mongoose.Types.ObjectId;
  sharedAt?: Date;
  contents?: string;
};

export type TPost = {
  _id?: ObjectId;
  user: ObjectId;
  content: string;
  imageUrls?: string[];
  likes?: ObjectId[];
  comments?: TComment[];
  createdAt?: Date;
  isReacted?: boolean;
  shares?: TShare[];
};
