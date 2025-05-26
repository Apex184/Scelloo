import { z } from 'zod';

export const UserLoginSchema = z.object({
    email: z
        .string()
        .email('Invalid email address')
        .toLowerCase()
        .min(5, 'Email address must be at least 5 characters long'),
    password: z.string().min(8),
});

export type UserLoginSchema = z.TypeOf<typeof UserLoginSchema>;
