import express from 'express';
import { paymentsControllers } from './payment.controller';



const router = express.Router();

router.post('/' , paymentsControllers.createPaymentIntent);
router.patch('/update-user-plane/:userId' , paymentsControllers.updateUserPlane);

export const PaymentsRoute = router;