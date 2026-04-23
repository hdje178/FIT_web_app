import path from "path";
import fs from "fs";
import sqlite3 from "sqlite3";
import {fileURLToPath} from "node:url";

const SQLite3 = sqlite3.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "app.db");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}
const db = new SQLite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Failed to open SQLite DB:", err.message);
        process.exit(1);
    }
    console.log("SQLite DB opened:", dbPath);
    db.run("PRAGMA foreign_keys = ON;");
});
export default db;

