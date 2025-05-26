import { RequestHandler } from 'express';

import { AuthorizationError } from '../errors';

export const adminOnly: RequestHandler = (req, res, next) => {
    const user = res.locals.user;
    if (user.roleName !== 'admin') {
        throw new AuthorizationError('Only Admins can perform this action.');
    }
    next();
};
