import { RequestHandler } from 'express';
import { UserRepository, RoleRepository } from '../repositories';
import { hash } from '../utils';
import { env } from '../config';
import { UserSignUpSchema } from '../input-validations';

export const userSignup: RequestHandler<any, any, UserSignUpSchema> = async (req, res) => {
    try {
        const { email, password, firstName, lastName, adminSecret } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: 'Email, password, first name and last name are required',
            });
        }

        const userRepo = new UserRepository();
        const roleRepo = new RoleRepository();

        let roleName = 'user';
        if (adminSecret !== undefined) {
            if (adminSecret !== env.ADMIN_SECRET) {
                return res.status(403).json({ message: 'Invalid admin secret' });
            }
            roleName = 'admin';
        }


        let role = await roleRepo.findByName(roleName);
        if (!role) {
            role = await roleRepo.create({
                roleName: roleName,
                description: `${roleName} role`,
            });
        }

        const existingUser = await userRepo.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await userRepo.transaction(async (trx) => {
            return await userRepo.create(
                {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                    isActive: true,
                    roleId: role?.id,
                },
                { transaction: trx },
            );
        });

        return res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
            },
        });
    } catch (error) {
        console.error('User signup error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};