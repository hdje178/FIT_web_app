import * as repository from "../repository/user.repository.js";
import AppError from "../errors/api.errors.js";
import type { CreateUserDto, UserDto, UpdateUserPatchDto, UpdateUserPutDto } from "../dto/user.dto.js";
import { v4 as uuid4 } from "uuid";



export async function getUsers(){
    const users = await repository.getUsers();
    return {items: users, total: users.length};
}
export async function getUserById(id: string){
    const user = await repository.getUserById(id);
    if (!user) {
        throw new AppError(404, "NOT_FOUND", "User with that id not found", id);
    }
    return user;
}
export async function addUser(payload: CreateUserDto): Promise<UserDto>{
    if (await repository.ifUserExist(payload.email)) {
        throw new AppError(409, "CONFLICT", "User with that email already exist", payload.email);
    }
    const id = uuid4();
    const user: UserDto = {
        id,
        name: payload.name,
        email: payload.email,
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await repository.addUser(user);
    return user;
}
export async function updateUserPatch(id: string, payload: UpdateUserPatchDto){
    if (payload.email){
        if (await repository.ifUserExist(payload.email)) {
            throw new AppError(409, "CONFLICT", "User with that email already exist", payload.email);
        }
    }
    const user = await repository.updateUserPatch(id, payload);
    if (!user) {
        throw new AppError(404, "NOT_FOUND", "User with that id not found", id);
    }
    return user;
}
export async function updateUserPut(id: string, payload: UpdateUserPutDto){
    if (payload.email){
        if (await repository.ifUserExist(payload.email)) {
            throw new AppError(409, "CONFLICT", "User with that email already exist", payload.email);
        }
    }
    const user = await repository.updateUserPut(id, payload);
    if (!user) {
        throw new AppError(404, "NOT_FOUND", "User with that id not found", id);
    }
    return user;
}

export async function deleteUser(id: string){
    const user = await repository.deleteUser(id);
    if (!user) {
        throw new AppError(404, "NOT_FOUND", "User with that id not found", id);
    }
}