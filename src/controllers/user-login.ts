import { RequestHandler } from 'express';

import { UserRepository } from '../repositories';
import { compareHash, COOKIE_OPTIONS, signJWT, TOKEN_EXPIRY } from '../utils';

import { UserLoginSchema } from '../input-validations';


export const userLogin: RequestHandler<any, any, UserLoginSchema> = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRepo = new UserRepository();

        const user = await userRepo.findByEmail(email);

        if (!user?.password || !(await compareHash(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = await signJWT({ userId: user.id }, TOKEN_EXPIRY.access);
        const refreshToken = await signJWT({ userId: user.id }, TOKEN_EXPIRY.refresh);

        res.cookie('token', accessToken, COOKIE_OPTIONS);
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        return res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: '',
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    } catch (error) {
        console.error('User login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
