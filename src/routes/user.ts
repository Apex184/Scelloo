import { Router } from 'express';

import { validate, adminOnly } from '../middleware';

import { userSignup, userLogin, getUsers } from '../controllers';
import { UserLoginSchema, UserSignUpSchema } from '../input-validations';

const router = Router();
const adminRouter = Router();

// Public routes
router.post('/signup', validate(UserSignUpSchema), userSignup);
router.post('/login', validate(UserLoginSchema), userLogin);

// Admin routes
adminRouter.get('/users', adminOnly, getUsers);

export const UserRoutes = router;
export const AdminRoutes = adminRouter;
