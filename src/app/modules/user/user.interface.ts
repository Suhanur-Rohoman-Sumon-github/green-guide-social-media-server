import { Model, Types } from 'mongoose';
import { User_Role, USER_STATUS } from './user.constant';

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
  status: keyof typeof USER_STATUS;
};

export type TUserModel = {
  isUserExistsByEmail(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
} & Model<TUser>


export type TUserRol = keyof typeof User_Role;
