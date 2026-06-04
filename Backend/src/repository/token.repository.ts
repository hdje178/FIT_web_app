import crypto from 'crypto';
import {run, get} from "../db/dbClient.js";
import type {RefreshTokenDb, RefreshTokenPayload} from "../types/JwtTokens.type.js";
import AppError from "../errors/api.errors.js";

export async function saveRefreshToken(userId: number, token: string) {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await run(
        'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
        [userId, hash, expiresAt]
    );
}

export async function isTokenBlacklisted(jti: string): Promise<boolean> {
    const row = await get('SELECT 1 FROM token_blacklist WHERE jti = ?', [jti]);
    return !!row;
}

export async function revokeRefreshToken(token: string) {
    const existing = await getRefreshTokenByToken(token);
    if (!existing || existing.revoked_at) return false;
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    await run(
        'UPDATE refresh_tokens SET revoked_at = datetime("now") WHERE token_hash = ?',
        [hash]
    );
    return true;
}
export async function getRefreshTokenByToken(token: string): Promise<RefreshTokenDb | undefined> {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return await get('SELECT * FROM refresh_tokens WHERE token_hash = ?', [hash]) as RefreshTokenDb | undefined;
}

export async function blacklistAccessToken(jti: string, exp: number) {
    await run(
        'INSERT OR IGNORE INTO token_blacklist (jti, expires_at) VALUES (?, datetime(?, "unixepoch"))',
        [jti, exp]
    );
}