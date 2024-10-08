import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendRespone";
import { friendRequestsServices } from "./friends.services";

const sendFriendRequests = catchAsync(async (req, res) => {
     const { sender, receiver } = req.body.friends;
     
   
    const result = await friendRequestsServices.sendFriendRequestsFromDB({
        sender,
        receiver,
    });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'request send  successfully',
    data: result,
  });
});
const getMyFriendsRequests = catchAsync(async (req, res) => {

const userId = req.params.userId

  
    const result = await friendRequestsServices.getMyRequests(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'my request retrieve successfully',
    data: result,
  });
});
const acceptFriendRequests = catchAsync(async (req, res) => {

const userId = req.params.userId
const friendId = req.params.friendID

  
    const result = await friendRequestsServices.createFriendRequestFromDb(userId,friendId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'request accepted successfully',
    data: result,
  });
});
const rejectedFriendRequests = catchAsync(async (req, res) => {

const userId = req.params.userId
const friendId = req.params.friendID

  
    const result = await friendRequestsServices.rejectedFriendRequestsFromDB(userId,friendId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friend request rejected successfully',
    data: result,
  });
});

export const friendRequestsControllers = {
    sendFriendRequests,
    getMyFriendsRequests,
    acceptFriendRequests,
    rejectedFriendRequests
}