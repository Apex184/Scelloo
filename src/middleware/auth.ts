import { RequestHandler } from 'express';

import { verifyJWT } from '../utils';

import { AuthenticationError } from '../errors';
import { UserRepository } from '../repositories';

export const authenticate: RequestHandler = async (req, res, next) => {
    try {
        const token = req.cookies.token ?? req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return next(new AuthenticationError('Sorry, you are not signed in'));
        }

        try {
            const decoded = (await verifyJWT(token)) as { userId: string; exp?: number };

            if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                return next(new AuthenticationError('Token has expired'));
            }

            res.locals.token = decoded;

            const userRepo = new UserRepository();
            const user = await userRepo.findByPk(decoded.userId);

            if (!user) {
                return next(new AuthenticationError('User not found'));
            }


            res.locals.user = user;

            next();
        } catch (error) {
            return next(new AuthenticationError('Sorry, you are not signed in'));
        }
    } catch (error) {
        return next(error);
    }
};
