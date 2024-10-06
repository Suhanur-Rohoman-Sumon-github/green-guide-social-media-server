import express from 'express';
import { userControllers } from './user.controller';

const router = express.Router();

// Admin creation route
router.post('/create-admin');
router.get('/get-me');
router.get('/get-all-user', userControllers.getAllUser);
router.get('/get-all-friends/:userId', userControllers.getMyFriends);
router.patch('/unfriend-user/:userId', userControllers.getMyFriends);

export const UserRoute = router;
