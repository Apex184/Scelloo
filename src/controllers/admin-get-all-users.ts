import { RequestHandler } from 'express';
import { Op } from 'sequelize';
import { UserRepository, RoleRepository } from '../repositories';
import { UpdateUserSchema } from '../input-validations';
import { Role } from '../models';
import { logger } from '../utils';




export const getUsers: RequestHandler = async (req, res) => {
    try {
        const user = res.locals.user;
        if (!user) {
            return res.status(403).json({ message: 'Unauthorized' });
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

        const formattedUsers = users.map(user => ({
            ...user.get({ plain: true })
        }));

        return res.status(200).json({
            message: 'Users fetched successfully',
            users: formattedUsers,
            pagination: {
                total: count,
                totalPages: Math.ceil(count / Number(limit)),
                currentPage: Number(page),
                pageSize: Number(limit)
            }
        });
    } catch (error) {
        logger.error('Get users error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Update User
// export const updateUser: RequestHandler<{ userId: string }, any, z.infer<typeof UserUpdateSchema>> = async (req, res) => {
//     try {
//         const currentUser = res.locals.user;
//         const { userId } = req.params;
//         const updates = req.body;

//         // Authorization check
//         if (currentUser.id !== userId && currentUser.role !== 'admin') {
//             return res.status(403).json({ message: 'Unauthorized' });
//         }

//         const userRepo = new UserRepository();

//         const updatedUser = await userRepo.transaction(async (trx) => {
//             const [affectedCount, users] = await userRepo.update(
//                 { id: userId },
//                 { ...updates, updatedAt: new Date() },
//                 {
//                     transaction: trx,
//                     returning: true,
//                     attributes: { exclude: ['password', 'refreshToken'] }
//                 }
//             );

//             if (affectedCount === 0) throw new NotFoundError('User not found');
//             return users[0];
//         });

//         return res.status(200).json({
//             message: 'User updated successfully',
//             user: updatedUser
//         });
//     } catch (error) {
//         logger.error('Update user error:', error);
//         return res.status(error instanceof NotFoundError ? 404 : 500).json({
//             message: error instanceof NotFoundError ? error.message : 'Internal server error'
//         });
//     }
// };

// Delete User
// export const deleteUser: RequestHandler<{ userId: string }> = async (req, res) => {
//     try {
//         const currentUser = res.locals.user;
//         const { userId } = req.params;

//         if (currentUser.role !== 'admin') {
//             return res.status(403).json({ message: 'Unauthorized' });
//         }

//         const userRepo = new UserRepository();

//         // Prevent admin deletion
//         const user = await userRepo.findByPk(userId);
//         if (!user || user.role === 'admin') {
//             return res.status(403).json({ message: 'Cannot delete admin user' });
//         }

//         const deletedCount = await userRepo.destroy({ id: userId });

//         if (deletedCount === 0) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         return res.status(204).send();
//     } catch (error) {
//         logger.error('Delete user error:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };