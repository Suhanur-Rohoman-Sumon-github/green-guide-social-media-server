import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendRespone';
import { PostServices } from './post.service';

const createPosts = catchAsync(async (req, res) => {
  const { user, content } = JSON.parse(req.body.data);

  if (!user || !content) {
    return res.status(400).json({
      success: false,
      message: 'User ID and content are required.',
    });
  }

  const result = await PostServices.creatPostInDB(
    { user, content, ...req.body },
    req.file,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post is created successfully',
    data: result,
  });
});
const getAllPosts = catchAsync(async (req, res) => {
  const result = await PostServices.getAllPostsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All posts retrieve successfully',
    data: result,
  });
});
const getSinglePosts = catchAsync(async (req, res) => {
  const postsId = req.params.id;

  const result = await PostServices.getSinglePostsFromDB(postsId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single posts retrieve successfully',
    data: result,
  });
});
const addComments = catchAsync(async (req, res) => {
  const postsId = req.params.postId;

  const comments = req.body;

  const result = await PostServices.addCommentsInDB(postsId, comments);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments added successfully',
    data: result,
  });
});
const addLikes = catchAsync(async (req, res) => {
  const postsId = req.params.postId;
  const userId = req.params.userId;

  const result = await PostServices.addLikesIntoDB(postsId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'like added successfully',
    data: result,
  });
});
const isReacted = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const postId = req.params.postId;

  const result = await PostServices.isReactedGetFromDB(userId, postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'is reacted return successfully',
    data: result,
  });
});
const getMyposts = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const result = await PostServices.getUserPostsFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'my posts  return successfully',
    data: result,
  });
});
const sharePosts = catchAsync(async (req, res) => {
  const postsId = req.params.postId;
  const userId = req.params.userId;

  const { contents } = req.body;

  const result = await PostServices.sharePostFromDb(userId, postsId, contents);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'post shared successfully',
    data: result,
  });
});
const addToFavorite = catchAsync(async (req, res) => {
  const postsId = req.params.postId;
  const userId = req.params.userId;

  const result = await PostServices.addFavoritePostsFromDB(userId, postsId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'favorite post added successfully',
    data: result,
  });
});
const getFavoritePosts = catchAsync(async (req, res) => {
  
  const userId = req.params.userId;

  const result = await PostServices.getFavoritePostsFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'favorite post added successfully',
    data: result,
  });
});

export const PostsControllers = {
  createPosts,
  getAllPosts,
  getSinglePosts,
  addComments,
  addLikes,
  isReacted,
  getMyposts,
  sharePosts,
  addToFavorite,
  getFavoritePosts
};
