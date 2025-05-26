import { RequestHandler } from 'express';
import { UserRepository } from '../repositories';
import { AuthenticationError } from '../errors';
import { logger } from '../utils';
import { User, Role } from '../models';

interface UserWithRole extends User {
    Role?: Role;
}

export const getUsers: RequestHandler = async (req, res) => {
    try {
        const user = res.locals.user as User;
        if (!user) throw new AuthenticationError();

        const userRole = await Role.findByPk(user.roleId);
        if (!userRole || userRole.roleName !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { page = 1, limit = 10 } = req.query;
        const userRepo = new UserRepository();

        const { count, rows: users } = await userRepo.findManyAndCount(
            {},
            {
                page: Number(page),
                limit: Number(limit),
            }
        );

        return res.status(200).json({
            message: 'Users fetched successfully',
            users: (users as UserWithRole[]).map(user => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            })),
            pagination: {
                total: count,
                totalPages: Math.ceil(count / Number(limit)),
                currentPage: Number(page),
                pageSize: Number(limit)
            }
        });
    } catch (error) {
        logger.error('Get users error:', error);
        if (error instanceof AuthenticationError) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};
