CREATE TABLE IF NOT EXISTS Users(
                                    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                    name TEXT NOT NULL,
                                    email TEXT NOT NULL UNIQUE,
                                    password TEXT NOT NULL,
                                    role TEXT NOT NULL DEFAULT 'USER',
                                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

CREATE TABLE IF NOT EXISTS Events (
                                      event_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      name TEXT NOT NULL UNIQUE,
                                      created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0 AND capacity < 200),
    description TEXT NOT NULL
    );

CREATE TABLE IF NOT EXISTS Registrations (
                                             registration_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                             user_id INTEGER NOT NULL,
                                             event_id INTEGER NOT NULL,
                                             status TEXT NOT NULL DEFAULT 'pending',
                                             created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    description TEXT,
    UNIQUE (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE RESTRICT
    );