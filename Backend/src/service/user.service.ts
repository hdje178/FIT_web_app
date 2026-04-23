import * as repository from "../repository/user.repository.js";
import AppError from "../errors/api.errors.js";
import type { CreateUserDto, UserDto, UpdateUserPatchDto, UpdateUserPutDto } from "../dto/user.dto.js";
import { v4 as uuid4 } from "uuid";
import bcrypt from 'bcryptjs';
import type {Paginated} from "../types/pagineted.type.js";
import type {UserRegistrationsDto} from "../dto/registrations.dto.js";
export function userErrorHandler(err: any):never {
    if (err.code === "SQLITE_CONSTRAINT") {
        if(err.message.includes("NOT NULL")){
            const field = err.message.split(": ")[2];
            throw new AppError( 400, "BAD_REQUEST", `Field ${field} is required`)
        }
        if(err.message.includes("UNIQUE")){
            const field = err.message.split(": ")[2];
            throw new AppError( 409, "CONFLICT", `That email is already exist`)
        }
        if(err.message.includes("FOREIGN KEY")){
            const field = err.message.split(": ")[2];
            throw new AppError( 409, "CONFLICT", `User is used and cannot be deleted`)
        }
    }
    if (err.code === "SQLITE_CONSTRAINT_NOTNULL") {
        throw new AppError(400, "BAD_REQUEST", "Missing required fields");
    }
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE" && err.message.includes("email")) {
        throw new AppError(409, "CONFLICT", "User with that email already exist");
    }
    if (err.code === "SQLITE_CONSTRAINT_PRIMARYKEY") throw new AppError(409, "CONFLICT", "Primary key conflict");
    if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
        throw new AppError(409, "CONFLICT", "Foreign key constraint failed");
    }
    if (err.code === "SQLITE_BUSY" || err.code === "SQLITE_LOCKED") {
        throw new AppError(503, "SERVER_ERROR", "Database busy, try again later");
    }
    throw new AppError(500, "SERVER_ERROR", "Internal server error");
}


export async function getUsers():Promise<Paginated<UserDto>>{
    const users = await repository.getUsers();
    return users;
}
export async function getUserById(id: number){
    let user: UserDto | null = await repository.getUserById(id);
    if (!user) {
        throw new AppError(404, "NOT_FOUND", "User with that id not found", id);
    }
    return user;
}
export async function getUserRegistration(id: number): Promise<Paginated<UserRegistrationsDto>> {
    const usersRegistration = await repository.getUserRegistration(id);
    return usersRegistration
}
export async function addUser(payload: CreateUserDto): Promise<UserDto>{
    const hashPasswd = await bcrypt.hash(payload.password, 10);
    const newUser = {
        name: payload.name,
        email: payload.email,
        password: hashPasswd,
        role: "USER",
    };
    let user: UserDto | null = await repository.addUser(newUser);
    if (!user) {
        throw new AppError(500, "SERVER_ERROR", "Retrieval failed");
    }
    return user;
}
export async function updateUserPatch(id: number, payload: UpdateUserPatchDto) {

    if (!payload || Object.keys(payload).length === 0) {
        throw new AppError(400, "BAD_REQUEST", "Empty update body");
    }

    const newPayload = { ...payload };

    if (payload.password) {
        newPayload.password = await bcrypt.hash(payload.password, 10);
    }

   await repository.updateUserPatch(id, newPayload);

    const user = await repository.getUserById(id);
    if (!user) {
        throw new AppError(404, "NOT_FOUND", "User with that id not found", id);
    }
    return user;
}
export async function updateUserPut(id: number, payload: UpdateUserPutDto) {

    if (!payload || Object.keys(payload).length === 0) {
        throw new AppError(400, "BAD_REQUEST", "Empty update body");
    }
    const newPayload = { ...payload };

    if (payload.password) {
        newPayload.password = await bcrypt.hash(payload.password, 10);
    }

    await repository.updateUserPut(id, newPayload);

    const user = await repository.getUserById(id);
    if (!user) {
        throw new AppError(404, "NOT_FOUND", "User with that id not found", id);
    }
    return user;
}

export async function deleteUser(id: number){
    let user: boolean | null = await repository.deleteUser(id);
    if (!user) {
        throw new AppError(404, "NOT_FOUND", "User with that id not found", id);
    }
    return true;
}
