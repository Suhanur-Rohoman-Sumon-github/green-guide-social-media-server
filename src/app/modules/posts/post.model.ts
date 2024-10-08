import mongoose from 'mongoose';
import { TPost } from './post.interface';

const postSchema = new mongoose.Schema<TPost>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    imageUrls: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        content: { type: String, required: true },
      },
    ],
    isReacted: { type: Boolean, default: false },
    shares: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        sharedPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
        sharedAt: { type: Date, default: Date.now },
        contents: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const PostModel = mongoose.model('Post', postSchema);
