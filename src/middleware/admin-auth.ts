import { RequestHandler } from 'express';
import { verifyJWT } from '../utils';
import { AuthenticationError, AuthorizationError } from '../errors';
import { UserRepository, RoleRepository } from '../repositories';

export const adminOnly: RequestHandler = async (req, res, next) => {
    const token = req.cookies.token ?? req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return next(new AuthenticationError('Authentication required'));
    }

    try {
        const decoded = (await verifyJWT(token)) as { userId: string };
        res.locals.token = decoded;

        const userRepo = new UserRepository();
        const roleRepo = new RoleRepository();
        const user = await userRepo.findByPk(decoded.userId);

        if (!user) {
            return next(new AuthenticationError('User not found'));
        }

        const role = await roleRepo.findByPk(user.roleId);

        if (!role) {
            return next(new AuthenticationError('Role not found'));
        }

        res.locals.user = user;

        if (role.roleName !== 'admin') {
            return next(new AuthorizationError('You do not have access to perform this action'));
        }

        next();
    } catch (error) {
        if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
            return next(error);
        }
        return next(new AuthenticationError('Invalid token'));
    }
};
