import config from '../../config';
import Stripe from 'stripe';
import { userModel } from '../user/user.model';
import AppError from '../../error/AppEroor';
import httpStatus from 'http-status';

const createPaymentIntentInDb = async (price: number) => {
  if (!config.stripe_secret) {
    throw new Error(
      'Stripe secret key is not set in the environment variables',
    );
  }
  const stripe = new Stripe(config?.stripe_secret);
  const amount = Math.round(price * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
};

const updateUserPlaneFromDb =  async (userId:string) =>{
const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },  
      { currentState: 'pro' }, 
      { new: true } 
    );

    
    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND,`User with ID: ${userId} not found`);
    }

    console.log(`User with ID: ${userId} successfully updated to pro`);
    return updatedUser;
}

export const paymentService = {
  createPaymentIntentInDb,
  updateUserPlaneFromDb
};