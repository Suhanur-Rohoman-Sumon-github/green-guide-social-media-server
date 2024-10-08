import express from 'express';
import { paymentsControllers } from './payment.controller';
import { User_Role } from '../user/user.constant';
import Auth from '../../middleware/Auth';


const router = express.Router();

router.post('/',Auth(User_Role.user || User_Role.admin) , paymentsControllers.createPaymentIntent);
router.patch('/update-user-plane/:userId',Auth(User_Role.user || User_Role.admin) , paymentsControllers.updateUserPlane);

export const PaymentsRoute = router;