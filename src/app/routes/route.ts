import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.route';
import { postRouters } from '../modules/posts/post.route';
import { friendsRoute } from '../modules/friend/friend.route';
import { UserRoute } from '../modules/user/user.route';
import { PaymentsRoute } from '../modules/payments/payment.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: '/posts',
    route: postRouters,
  },
  {
    path: '/friends',
    route: friendsRoute,
  },
  {
    path: '/users',
    route: UserRoute,
  },
  {
    path: '/payments',
    route: PaymentsRoute,
  },
];

moduleRoutes.forEach((routes) => router.use(routes.path, routes.route));

export default router;
