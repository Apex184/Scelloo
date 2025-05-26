import { z } from 'zod';

export const UserSignUpSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z
        .string()
        .email('Invalid email address')
        .toLowerCase()
        .min(5, 'Email address must be at least 5 characters long'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one capital letter')
        .regex(/[a-z]/, 'Password must contain at least one small letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    adminSecret: z.string().optional(),

});

export type UserSignUpSchema = z.TypeOf<typeof UserSignUpSchema>;
