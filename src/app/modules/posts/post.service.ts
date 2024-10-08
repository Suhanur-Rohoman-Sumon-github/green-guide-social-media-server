import mongoose from 'mongoose';
import { TComment, TPost, TShare } from './post.interface';
import { PostModel } from './post.model';
import { userModel } from '../user/user.model';
import AppError from '../../error/AppEroor';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { postSearchableFields } from './post.constant';


const creatPostInDB = async (
  payload: TPost,
  images: Express.Multer.File[] | undefined,
) => {


  const imageUrls = images ? images.map(image => image.path) : []; 
  const newData = { ...payload, imageUrls }; 

  const result = await PostModel.create(newData);
  return result;
};
const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  
  const PostsQuery = new QueryBuilder(PostModel.find(), query)
    .search(postSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();
  const result = await PostsQuery.modelQuery.populate('user');
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

    const formattedCreatedPosts = createdPosts.map(post => ({
    ...post.toObject(), 
    postType: 'created', 
  }));

  const formattedSharedPosts = sharedPosts.map(post => ({
    ...post.toObject(), 
    postType: 'shared', 
  }));

    const allPosts = [...formattedCreatedPosts, ...formattedSharedPosts];
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

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

 
  return user.myFavorite;
};
const deleteMyPostsFromDb = async (postId: string, userId: string) => {
  const post = await PostModel.findOne({ _id: postId, user: userId });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found or not authorized');
  }
  post.isDeleted = true;
  await post.save();
  return post;
};


const deleteSharedPost = async (postId: string, userId: string) => {

  

  
  const updatedPost = await PostModel.findOneAndUpdate(
    { _id: postId, 'shares.user': userId }, 
    { $pull: { shares: { user: userId } } }, 
    { new: true } 
  );

 
  if (!updatedPost) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found or not shared by this user');
  }

  
  return updatedPost;
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
  getFavoritePostsFromDB,
  deleteMyPostsFromDb,
  deleteSharedPost
};
