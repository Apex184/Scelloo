// src/config/env.ts
import { z } from 'zod';
import dotenv from 'dotenv';
import { logger } from '../utils';

dotenv.config();

const envSchema = z
    .object({
        NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
        PORT: z.coerce.number().default(3001),
        JWT_SECRET: z.string().min(1, 'JWT secret is required'),
        DATABASE_URL: z.string().min(1, 'Database URL is required'),
        ADMIN_SECRET: z.string().optional(),
        DATABASE_MAX_POOL: z.coerce.number().min(0).default(5),
        DATABASE_MIN_POOL: z.coerce.number().min(0).default(1),
        SHOW_DATABASE_QUERIES: z.coerce.boolean().default(false),
    })
    .refine((env) => env.DATABASE_MAX_POOL >= env.DATABASE_MIN_POOL, {
        message: 'DATABASE_MAX_POOL must be greater than or equal to DATABASE_MIN_POOL',
        path: ['DATABASE_MAX_POOL'],
    });

type Env = z.infer<typeof envSchema>;

export function assertEnv(env: unknown): asserts env is Env {
    const result = envSchema.safeParse(env);

    if (!result.success) {
        const errorMessages = result.error.issues.map(
            issue => `${issue.path.join('.')} - ${issue.message}`
        );

        console.error('Environment Validation Errors:');
        errorMessages.forEach(message => console.error(`- ${message}`));

        throw new Error('Invalid environment variables');
    }

    logger.info('✅ Env validated successfully!');
}

assertEnv(process.env);

export const env = envSchema.parse(process.env);
export const isDev = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
export const isStaging = env.NODE_ENV === 'staging';
export const isProd = env.NODE_ENV === 'production';