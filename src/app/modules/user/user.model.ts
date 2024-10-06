import mongoose from 'mongoose';
import { TUser } from './user.interface';

const userSchema = new mongoose.Schema<TUser>(
  {
    username: { type: String },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    profilePicture: {
      type: String,
      default: 'https://i.ibb.co.com/K2D8vpy/download.png',
    },
    coverPhoto: { type: String },
    bio: { type: String, maxlength: 160 },
    website: { type: String },
    location: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    myFavorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' }],
    id: { type: String, unique: true },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    currentState: {
      type: String,
      enum: ['pro', 'free'],
      default: 'free',
    },
  },
  {
    timestamps: true,
  },
);

export const userModel = mongoose.model('User', userSchema);
