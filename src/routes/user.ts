import { Router } from 'express';

import { validate, adminOnly } from '../middleware';

import { userSignup, userLogin, getUsers } from '../controllers';
import { UserLoginSchema, UserSignUpSchema } from '../input-validations';

const router = Router();

router.post('/signup', validate(UserSignUpSchema), userSignup);
router.post('/login', validate(UserLoginSchema), userLogin);
router.get('/', adminOnly, getUsers);

export const UserRoutes = router;
