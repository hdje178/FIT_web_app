CREATE TABLE refresh_tokens (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                user_id INTEGER,
                                token_hash TEXT NOT NULL,
                                expires_at TEXT NOT NULL,
                                revoked_at TEXT,
                                created_at TEXT DEFAULT (datetime('now')),
                                FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);