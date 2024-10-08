import express from 'express';

import { PostsControllers } from './post.controller';
import { multerUpload } from '../../config/multer.config';



const router = express.Router();

router.post('/', multerUpload.array('images'), PostsControllers.createPosts);
router.get('/', PostsControllers.getAllPosts);
router.get('/:id', PostsControllers.getSinglePosts);
router.patch('/:postId', PostsControllers.addComments);
router.patch('/likes/:postId/:userId', PostsControllers.addLikes);
router.get('/isReacted/:userId/:postId', PostsControllers.isReacted);
router.get('/my-profile/:userId', PostsControllers.getMyposts);
router.patch('/share/:postId/:userId', PostsControllers.sharePosts);
router.patch('/addFavorite/:postId/:userId', PostsControllers.addToFavorite);
router.get('/All-Favorite/:userId', PostsControllers.getFavoritePosts);

// router.post('/refresh-token', AuthControllers.getRefreshToken);

export const postRouters = router;
