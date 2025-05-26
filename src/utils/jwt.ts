import jwt, { SignOptions } from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

export function signJWT(
    payload: string | Record<string, unknown> | Buffer,
    options: SignOptions = { expiresIn: '1d' },
): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_SECRET!, options, (err, token) => {
            if (err) return reject(err);
            return resolve(token ?? '');
        });
    });
}

export function verifyJWT<T = any>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
            if (err) return reject(err);
            if (!payload) return reject(new Error('Invalid token payload'));
            return resolve(payload as T);
        });
    });
}

export const TOKEN_EXPIRY = {
    access: { expiresIn: '1d' },
    refresh: { expiresIn: '7d' },
} as const;

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : ('strict' as const),
    path: '/',
} as const;
