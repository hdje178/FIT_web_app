import jwt from 'jsonwebtoken';
import type {TokenPayload, RefreshTokenPayload} from "../types/JwtTokens.type.js"
import AppError from "../errors/api.errors.js";
import * as tokenRepository from '../repository/token.repository.js';

export async function authMiddleware(req: any, res: any, next: any){
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next(new AppError(401, "UNAUTHORIZED", "Authorization token is missing"));
    let payload;
    try{
        payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as TokenPayload
    }catch (err: any) {
        if (err.name === "TokenExpiredError") return next(new AppError(401, "TOKEN_EXPIRED", "Token is expired"));
        return next(new AppError(401, "TOKEN_INVALID", "Token is invalid"));
    }
    const blacklisted = await tokenRepository.isTokenBlacklisted(payload.jti) ;
    if (blacklisted) return next(new AppError(401, 'TOKEN_REVOKED', 'Token is revoked'));
    req.user = payload;
    next();
}
export function roleBasedMiddleware(role: "USER" | "ADMIN") {
    return async (req: any, res: any, next: any) => {
        if (!req.user) return next(new AppError(401, "UNAUTHORIZED", "User not authenticated"));
        if (req.user.role !== role) return next(new AppError(403, "FORBIDDEN", "Access denied"));
        next();
    }
}
export function alreadyAuthMiddleware(req: any, res: any, next: any) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next();

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
        return next(new AppError(400, 'ALREADY_AUTHENTICATED', 'User is already logged in'));
    } catch {
        return next();
    }
}