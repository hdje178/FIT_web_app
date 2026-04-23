import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs'; import path from 'path';
import { all, run } from './dbClient.js';
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);
const dir = path.join(__dirname, "..", 'migrations');

async function ensureTable(){
    console.log("[migrations] ensureTable: старт");
    await run(`CREATE TABLE IF NOT EXISTS schema_migrations(
    version TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (datetime('now')))`);
    console.log("[migrations] ensureTable: таблиця створена");
}
export async function runMigrations(){
    console.log("[migrations] runMigrations: старт");
    await ensureTable();
    console.log("[migrations] ensureTable: done");

    const applied = new Set((await all<{version:string}>(`SELECT version FROM schema_migrations`)).map(r=>r.version));
    console.log("[migrations] applied:", [...applied]);

    const files = fs.readdirSync(dir).filter(f=>f.endsWith('.sql')).sort();
    console.log("[migrations] files:", files);

    for(const f of files){
        const version = f.split('_')[0];
        console.log(`[migrations] file: ${f}, version: ${version}`);
        if(!version) { console.log("[migrations] skip: no version"); continue; }
        if(applied.has(version)) { console.log(`[migrations] skip: вже застосовано`); continue; }

        const sql = fs.readFileSync(path.join(dir,f),'utf8');
        const statements = sql.split(';').map(s=>s.trim()).filter(s=>s.length > 0);
        console.log(`[migrations] statements: ${statements.length}`);
        statements.forEach((s, i) => console.log(`  [${i}]: ${s.slice(0,60)}...`));

        await run('BEGIN');
        try {
            for(const stmt of statements){
                console.log(`[migrations] running stmt: ${stmt.slice(0,60)}...`);
                await run(stmt);
                console.log(`[migrations] stmt ok`);
            }
            await run(`INSERT INTO schema_migrations(version) VALUES (?)`, [version]);
            await run('COMMIT');
            console.log(`[migrations] ${f}: done`);
        } catch(e) {
            console.error(`[migrations] error:`, e);
            await run('ROLLBACK');
            throw e;
        }
    }
    console.log("[migrations] все готово");
}
runMigrations().catch(console.error);