import { Router } from 'express';

import { validate } from '../middleware';

import { userSignup, userLogin } from '../controllers';
import { UserLoginSchema, UserSignUpSchema } from '../input-validations';

const router = Router();

router.post('/signup', validate(UserSignUpSchema), userSignup);
router.post('/login', validate(UserLoginSchema), userLogin);

export const UserRoutes = router;
