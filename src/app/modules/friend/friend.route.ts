
import express from 'express';



import { friendRequestsControllers } from './friends.controllers';
import Auth from '../../middleware/Auth';
import { User_Role } from '../user/user.constant';

const router = express.Router();

router.post(
  '/',
  Auth(User_Role.user || User_Role.admin) ,
  friendRequestsControllers.sendFriendRequests,
);
router.get(
  '/get-my-friendsRequests/:userId',
  Auth(User_Role.user || User_Role.admin) ,
  friendRequestsControllers.getMyFriendsRequests,
);
router.patch(
  '/accept/:userId/:friendID',
  Auth(User_Role.user || User_Role.admin) ,
  friendRequestsControllers.acceptFriendRequests,
);
router.patch(
  '/reject/:userId/:friendID',
  Auth(User_Role.user || User_Role.admin) ,
  friendRequestsControllers.rejectedFriendRequests,
);




// router.post('/refresh-token', AuthControllers.getRefreshToken);

export const friendsRoute = router;
