import type {UserDto, UpdateUserPatchDto, UpdateUserPutDto, UserDbDto, CreateUserDto} from "../dto/user.dto.js";
import {run, get, all} from "../db/dbClient.js"
import type {RunResult} from "../db/dbClient.js"
import {mapFromDbtoUserDto} from "../dto/dto.func.js"
import AppError from "../errors/api.errors.js";
import type {Paginated} from "../types/pagineted.type.js";
import type {UserRegistrationsDto} from "../dto/registrations.dto.js";

export async function getUsers(): Promise<Paginated<UserDto>> {
    const usersDb: UserDbDto[]  = await all<UserDbDto>("SELECT user_id, name, email,password, role,created_at, updated_at FROM Users ORDER BY user_id DESC ") ;
    const total: number = usersDb.length;
    return {data: usersDb.map(mapFromDbtoUserDto), total};
}
export async function getUserById(id: number):Promise<UserDto | null> {
    const userDb: UserDbDto | null  = await get<UserDbDto>
    ("SELECT user_id, name, email,password, role,created_at, updated_at FROM Users WHERE user_id=? ORDER BY user_id DESC", [Number(id)]);
    if (!userDb) {
        return null;
    }
    return mapFromDbtoUserDto(userDb);
}

export async function getUserRegistration(id: number): Promise<Paginated<UserRegistrationsDto>> {
    const sql = `SELECT r.registration_id, r.status, r.created_at, r.updated_at, r.description,
                        e.event_id, e.name AS event_name, e.date AS event_date, e.location, e.capacity
                 FROM Registrations r
                          JOIN Events e ON e.event_id = r.event_id
                 WHERE r.user_id = ?
                 ORDER BY r.registration_id DESC
                 `
    const userRegistration = await all<UserRegistrationsDto>(sql, [Number(id)])
    return {data: userRegistration, total: userRegistration.length}
}

export async function addUser(user: CreateUserDto): Promise<UserDto | null> {
    console.log("INSERT payload:", {
        name: user.name,
        email: user.email,
        password: user.password,
        role: 'USER'
    });
    const sql = "INSERT INTO Users(name, email,password, role) VALUES (?, ?, ?, ?)"
    console.log("SQL:", sql);
    const runUserDb: RunResult = await run(sql,  [user.name, user.email, user.password, 'USER'])
    const userDb = await getUserById(runUserDb.lastID)
    return userDb;
}
export async function updateUserPatch(
    id: number,
    payload: UpdateUserPatchDto
): Promise<RunResult> {

    const fields: string[] = [];
    const values: any[] = [];

    if (payload.name !== undefined) {
        fields.push("name = ?");
        values.push(payload.name);
    }

    if (payload.email !== undefined) {
        fields.push("email = ?");
        values.push(payload.email);
    }

    if (payload.password !== undefined) {
        fields.push("password = ?");
        values.push(payload.password);
    }

    fields.push("updated_at = ?");
    values.push(new Date().toISOString());

    const sql = `UPDATE Users SET ${fields.join(", ")} WHERE user_id = ?`;
    values.push(id);

    return run(sql, values);
}
export async function updateUserPut(
    id: number,
    payload: UpdateUserPutDto
): Promise<RunResult> {

    return run(
        "UPDATE Users SET name=?, email=?, password=?, updated_at=? WHERE user_id=?",
        [
            payload.name,
            payload.email,
            payload.password,
            new Date().toISOString(),
            id
        ]
    );
}
export async function deleteUser(id: number): Promise<boolean | null> {
    const runUserDb:RunResult = await run("DELETE FROM Users WHERE user_id=?", [Number(id)])
    if (runUserDb.changes === 0){
        return null;
    }
    return true;
}
