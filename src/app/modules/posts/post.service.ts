import mongoose from 'mongoose';
import { TComment, TPost, TShare } from './post.interface';
import { PostModel } from './post.model';
import { userModel } from '../user/user.model';
import AppError from '../../error/AppEroor';
import httpStatus from 'http-status';

const creatPostInDB = async (
  payload: TPost,
  image: Express.Multer.File | undefined,
) => {
  const imageUrl = image?.path;
  const newData = { ...payload, imageUrl };
  const result = PostModel.create(newData);
  return result;
};
const getAllPostsFromDB = async () => {
  const result = PostModel.find().populate('user');
  return result;
};
const getSinglePostsFromDB = async (postId: string) => {
  const result = await PostModel.findOne({
    _id: new mongoose.Types.ObjectId(postId),
  })
    .populate('user')
    .populate('comments.user');
  return result;
};
const addCommentsInDB = async (postId: string, commentData: TComment) => {
  console.log(commentData);
  console.log(postId);
  const updatedPost = await PostModel.findByIdAndUpdate(
    postId,
    {
      $push: { comments: commentData },
    },
    { new: true },
  );
  return updatedPost;
};
const addLikesIntoDB = async (postId: string, userId: string) => {
  const post = await PostModel.findById(postId);

  console.log(post?.likes);

  if (!post) {
    throw new Error(`Post with ID ${postId} not found.`);
  }

  let hasUserLiked = false;

  if (post.likes && Array.isArray(post.likes)) {
    hasUserLiked = post.likes.some((like) => like.toString() === userId);
  }

  console.log(hasUserLiked);

  let updatedPost;

  if (hasUserLiked) {
    updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: new mongoose.Types.ObjectId(userId) },
      },
      { new: true },
    );
    console.log(`Like removed for user ${userId}`);
  } else {
    updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $addToSet: { likes: new mongoose.Types.ObjectId(userId) },
      },
      { new: true },
    );
    console.log(`Like added for user ${userId}`);
  }

  return updatedPost;
};

const isReactedGetFromDB = async (userId: string, postId: string) => {
  const post = await PostModel.findById(postId);
  if (!post) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasReacted = post.likes?.some(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (likeId: any) => likeId.toString() === userId,
  );
  return hasReacted;
};

const getUserPostsFromDB = async (userId: string) => {
  
  const objectId = new mongoose.Types.ObjectId(userId);

  
  const createdPosts = await PostModel.find({ user: objectId }).populate(
    'user',
  );

  
  const sharedPosts = await PostModel.find({ 'shares.user': objectId })
    .populate('user')
    .populate('shares.user', 'username'); 

  
  const allPosts = [...createdPosts, ...sharedPosts];

 

  return allPosts;
};

const sharePostFromDb = async (
  userId: string,
  postId: string,
  contents: string,
) => {
  const objectId = new mongoose.Types.ObjectId(userId);
  const postObjectId = new mongoose.Types.ObjectId(postId);

  const post = await PostModel.findById(postObjectId);
  if (!post) {
    throw new Error('Post not found');
  }

  
  const share: TShare = {
    user: objectId,
    sharedPostId: postObjectId,
    sharedAt: new Date(),
    contents: contents || '',
  };

  if (!post.shares) {
    post.shares = [];
  }

  post.shares.push(share);
  await post.save();

  return post;
};
const addFavoritePostsFromDB = async (
  userId: string,
  postId: string,
) => {
  
  const user = await userModel.findById(userId);

 
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,"User not found");
  }

  
  

  const postObjectId = new mongoose.Types.ObjectId(postId);

 
  if (user.myFavorite.includes(postObjectId)) {
    throw new AppError(httpStatus.ALREADY_REPORTED,"Post is already in favorites");
  }

 
  user.myFavorite.push(postObjectId);

 
  await user.save();
};
const getFavoritePostsFromDB = async (userId: string) => {
  // Fetch the user by userId and populate the 'myFavorite' field with post details
  const user = await userModel
    .findById(userId)
    .populate({
      path: 'myFavorite',  
      model: PostModel,    
      populate: {
        path: 'user',      
        model: userModel,  
      
      },
    });

  // Check if user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Return the populated favorite posts
  return user.myFavorite;
};

export const PostServices = {
  creatPostInDB,
  getAllPostsFromDB,
  getSinglePostsFromDB,
  addCommentsInDB,
  addLikesIntoDB,
  isReactedGetFromDB,
  getUserPostsFromDB,
  sharePostFromDb,
  addFavoritePostsFromDB,
  getFavoritePostsFromDB
};
