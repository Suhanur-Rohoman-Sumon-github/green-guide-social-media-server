import express from 'express';
import { userControllers } from './user.controller';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

// Admin creation route
router.post('/create-admin');
router.get('/get-me/:userId',userControllers.getMe);
router.get('/get-all-user', userControllers.getAllUser);
router.get('/get-all-friends/:userId', userControllers.getMyFriends);
router.patch('/unfriend-user/:userId', userControllers.getMyFriends);
router.post('/update-profile/:userId',multerUpload.single('profilePicture'), userControllers.updateProfilePicture);
router.post('/update-cover/:userId',multerUpload.single('coverPhoto'), userControllers.updateCoverPhoto);
router.patch('/update-bio/:userId', userControllers.updateBio);
router.delete('/unfriend-user/:userId/:friendId', userControllers.unfriendUser);

export const UserRoute = router;
