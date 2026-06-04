import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export function generateTokens(userId: number, role: "USER" | "ADMIN") {
    const jti = crypto.randomUUID();

    const accessToken = jwt.sign(
        { userId, role, jti },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: '60m' }
    );

    const refreshToken = jwt.sign(
        { userId, jti: crypto.randomUUID() },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
}