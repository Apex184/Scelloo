import { z } from 'zod';

export const UpdateUserSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    isActive: z.boolean().optional()
});

export type UpdateUserSchema = z.TypeOf<typeof UpdateUserSchema>;