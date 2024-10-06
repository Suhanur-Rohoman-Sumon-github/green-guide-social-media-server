import { Model, Types } from 'mongoose';
import { User_Role } from './user.constant';

export type TUser = {
  _id?: Types.ObjectId; 
  id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture?: string;
  coverPhoto?: string;
  bio?: string;
  website?: string;
  location?: string;
  followers?: Types.ObjectId[]; 
  following?: Types.ObjectId[]; 
  friends?: Types.ObjectId[]; 
  createdAt?: Date;
  updatedAt?: Date;
  role: string;
  isDeleted: boolean;
  currentState: 'pro' | 'free';
  myFavorite: Types.ObjectId[]; 
};

// Replacing interface with type and using intersection type
export type UserModels = Model<TUser> & {
  isUserExistFindByEmail(email: string): Promise<TUser | null>;
  isPasswordMatched(password: string, hashedPassword: string): Promise<boolean>;
};

export type TUserRol = keyof typeof User_Role;
