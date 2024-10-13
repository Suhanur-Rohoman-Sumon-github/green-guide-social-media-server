import express from 'express';

import { PostsControllers } from './post.controller';
import { multerUpload } from '../../config/multer.config';
import Auth from '../../middleware/Auth';
import { User_Role } from '../user/user.constant';



const router = express.Router();

router.post('/', Auth(User_Role.user , User_Role.admin) ,multerUpload.array('images'), PostsControllers.createPosts);
router.get('/',Auth(User_Role.user , User_Role.admin) , PostsControllers.getAllPosts);
router.get('/:id',Auth(User_Role.user , User_Role.admin) , PostsControllers.getSinglePosts);
router.patch('/:postId',Auth(User_Role.user , User_Role.admin) , PostsControllers.addComments);
router.patch('/likes/:postId/:userId',Auth(User_Role.user , User_Role.admin) , PostsControllers.addLikes);
router.get('/isReacted/:userId/:postId',Auth(User_Role.user , User_Role.admin) , PostsControllers.isReacted);
router.get('/my-profile/:userId',Auth(User_Role.user , User_Role.admin) , PostsControllers.getMyposts);
router.patch('/share/:postId/:userId',Auth(User_Role.user , User_Role.admin) , PostsControllers.sharePosts);
router.patch('/addFavorite/:postId/:userId',Auth(User_Role.user , User_Role.admin) , PostsControllers.addToFavorite);
router.get('/All-Favorite/:userId',Auth(User_Role.user , User_Role.admin) , PostsControllers.getFavoritePosts);
router.patch('/delete-myPost/:postId/:userId',Auth(User_Role.user , User_Role.admin) , PostsControllers.deleteMyPosts);
router.delete('/delete-sharedPosts/:postId/:userId',Auth(User_Role.user , User_Role.admin) , PostsControllers.deleteSharedPosts);
router.post('/updatePosts/:postId',Auth(User_Role.user , User_Role.admin),multerUpload.array('images') , PostsControllers.updatePost);

// router.post('/refresh-token', AuthControllers.getRefreshToken);

export const postRouters = router;
