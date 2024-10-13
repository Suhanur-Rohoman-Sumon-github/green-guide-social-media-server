import mongoose from 'mongoose';
import { TUser, TUserModel } from './user.interface';
import bcryptjs from 'bcryptjs';


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

userSchema.pre<TUser>('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
 
    const salt = await bcryptjs.genSalt(10); 
    this.password = await bcryptjs.hash(this.password, salt);
  
  next(); // Call the next middleware
});

// Add the static methods to the userSchema
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
) {
  return await bcryptjs.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: number,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

// Export the model with the correct type
export const userModel = mongoose.model<TUser, TUserModel>('User', userSchema);
