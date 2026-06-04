import type { Request, Response, NextFunction } from "express";
import * as authService from "../service/auth.service.js"
import * as userService from "../service/user.service.js";
import AppError from "../errors/api.errors.js";
import {mapAuthUserToView, mapUserToView} from "../dto/dto.func.js";
import type {TokenPayload} from "../types/JwtTokens.type.js";
import type {UserResponseDto} from "../dto/user.dto.js";

export async function register(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const user = await authService.register(body);
    const userToView = mapAuthUserToView(user.user)
    res.status(201).cookie("refreshToken", user.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }).json({user: userToView, accessToken: user.accessToken});
}
export async function login(req: Request, res: Response, next: NextFunction) {
    const {email, password} = req.body;
    const login = await authService.login(email, password);
    const refreshToken = login.refreshToken
    const userToView = mapAuthUserToView(login.user)
    res.status(200).cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }).json({user: userToView, accessToken: login.accessToken});
}
export async function refresh(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return next(new AppError(401, "UNAUTHORIZED", "Refresh token is missing"));
    const refresh = await authService.refresh(refreshToken);
    res.status(200).cookie("refreshToken", refresh.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }).json({accessToken: refresh.accessToken});
}
export async function logout(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.headers.authorization?.split(" ")[1]
    await authService.logout(accessToken, refreshToken)
    res.clearCookie("refreshToken").status(200).json({ok: true, message: "Logout successful"});
}
export function isUserAuthorised(req: Request, res: Response, next: NextFunction) {
    try {
        res.json({ user: (req as any).user as TokenPayload});
    } catch (err) {
        next(err);
    }
}
export async function getProfile(req: Request, res: Response, next: NextFunction) {
    const user = await userService.getUserById((req as any).user.userId);
        if (!user) return next(new AppError(404, 'NOT_FOUND', 'User not found'));
        const viewUser: UserResponseDto = mapUserToView(user);
        res.json({ user: viewUser });
}
