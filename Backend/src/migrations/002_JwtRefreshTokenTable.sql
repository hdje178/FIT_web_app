CREATE TABLE refresh_tokens (
                                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                                user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
                                token_hash TEXT NOT NULL,
                                expires_at TEXT NOT NULL,
                                revoked_at TEXT,
                                created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE token_blacklist (
                                 jti        TEXT PRIMARY KEY,
                                 expires_at TEXT NOT NULL
);
