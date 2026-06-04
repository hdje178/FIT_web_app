import type {JwtPayload} from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
    userId: number;
    role: string;
    jti: string;
    exp: number;
}
export interface RefreshTokenPayload extends JwtPayload {
    userId: number;
}
export interface RefreshTokenDb{
    id: number;
    user_id: number,
    token_hash: string,
    expires_at: string,
    revoked_at: string | null,
    created_at: string
}