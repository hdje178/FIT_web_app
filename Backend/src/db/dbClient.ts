import db from "../db/db.js"
export type RunResult = {
    changes: number;
    lastID: number;
};

function all<T>(sql: string, params: unknown[] = []):Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
        db.all(sql,params, (err, rows) => (err ? reject(err) : resolve((rows as T[] | undefined )?? [])));
    });
}
function get<T>(sql: string, params: unknown[] = []):Promise<T | null> {
    return new Promise<T | null>((resolve, reject) => {
        db.get(sql,params, (err, row) => (err ? reject(err) : resolve((row as T | undefined )?? null)));
    });
}
function run(sql: string, params: unknown[] = []): Promise<RunResult> {
    return new Promise<RunResult>((resolve, reject) => {
        db.run(sql,params, function (err) {
            if (err) return reject(err);
            resolve({
                changes: this.changes ?? 0,
                lastID: Number(this.lastID ?? 0)
            });
        });
    });
}
export {all, get, run};

