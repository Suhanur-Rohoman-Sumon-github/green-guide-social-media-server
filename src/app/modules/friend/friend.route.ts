
import express from 'express';



import { friendRequestsControllers } from './friends.controllers';


const router = express.Router();

router.post(
  '/',
  
  friendRequestsControllers.sendFriendRequests,
);
router.get(
  '/get-my-friendsRequests/:userId',

  friendRequestsControllers.getMyFriendsRequests,
);
router.patch(
  '/accept/:userId/:friendID',
  
  friendRequestsControllers.acceptFriendRequests,
);
router.patch(
  '/reject/:userId/:friendID',
 
  friendRequestsControllers.rejectedFriendRequests,
);




// router.post('/refresh-token', AuthControllers.getRefreshToken);

export const friendsRoute = router;
