import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();

const getTransports = () => {
    const commonOptions = {
        ignore: 'pid,hostname',
        translateTime: 'SYS:standard',
    };

    switch (process.env.NODE_ENV) {
        case 'production':
            return {
                target: 'pino/file',
                options: { ...commonOptions, destination: './logs/production.log' }
            };
        case 'staging':
            return {
                target: 'pino/file',
                options: { ...commonOptions, destination: './logs/staging.log' }
            };
        case 'test':
            return {
                target: 'pino/file',
                options: { ...commonOptions, destination: './logs/test.log' }
            };
        default:
            return {
                target: 'pino-pretty',
                options: { ...commonOptions, colorize: true }
            };
    }
};

export const logger = pino({
    transport: {
        targets: [getTransports()]
    },
    redact: {
        paths: [
            'headers.authorization',
            'headers.Authorization',
            'headers.cookie',
            'headers["set-cookie"]',
            'headers["Set-Cookie"]',
            'headers.referer',
            'headers["X-Forwarded-For"]',
            'headers["x-forwarded-for"]',
            'password',
            'secret',
            'token',
            'refreshToken',
            'accessToken',
            'JWT_SECRET',
            'DATABASE_URL',
        ],
        censor: '**REDACTED**'
    }
});