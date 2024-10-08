import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { paymentService } from './payment.servces';
import sendResponse from '../../utils/sendRespone';


const createPaymentIntent = catchAsync(async (req, res) => {
  const  {price}  = req.body;
  console.log(price);

  const results = await paymentService.createPaymentIntentInDb(price);
  sendResponse(res, {
    statusCode: httpStatus.OK, 
    success: true,
    message: 'new payment intent added',
    data: results,
  });
});
const updateUserPlane = catchAsync(async (req, res) => {
  const userId = req.params.userId

  const results = await paymentService.updateUserPlaneFromDb(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK, 
    success: true,
    message: 'user plane updated successfully',
    data: results,
  });
});

export const paymentsControllers = {
  createPaymentIntent,
  updateUserPlane
};