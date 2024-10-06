import mongoose, { Document, Schema } from 'mongoose';
import { TFriendRequest } from './friends.interface';

// Define the FriendRequest schema
const FriendRequestSchema = new Schema<TFriendRequest & Document>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

// Create the FriendRequest model
export const FriendRequestModel = mongoose.model<TFriendRequest>(
  'FriendRequest',
  FriendRequestSchema,
);
