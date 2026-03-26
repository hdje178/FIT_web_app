import { v4 as uuid4 } from "uuid";
import type {UserResponseDto, UserDto, CreateUserDto, ParamsUserDto, UpdateUserPatchDto , UpdateUserPutDto} from "../dto/user.dto.js";
import bcrypt from "bcrypt"
import {events} from "./event.repository.js";

export let users: UserDto[] = [
    {
        id: "1",
        email: "user@gmail.com",
        passwordHash: "hash1",
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "2",
        email: "admin@gmail.com",
        passwordHash: "hash2",
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];
export async function getUsers(): Promise<UserDto[]> {
    return users ? structuredClone(users) : [];
}
export async function getUserById(id: string):Promise<UserDto | undefined> {
    const user = users.find(user => user.id === id);
    return user ? structuredClone(user) : undefined;
}
export async function addUser(user: UserDto): Promise<UserDto> {
    await users.push(user);
    return user;
}
export async function updateUserPatch(id: string, payload: UpdateUserPatchDto): Promise<UserDto | undefined> {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return undefined;
    const oldUser = users[index]
    if (!oldUser){
        return undefined;
    }
    const updatedUser: UserDto = {
        id: oldUser.id,
        email: payload.email ?? oldUser.email,
        passwordHash: payload.password ? await bcrypt.hash(payload.password, 10) : oldUser.passwordHash,
        role: oldUser.role,
        createdAt: oldUser.createdAt,
        updatedAt: new Date(),
    };
    users.splice(index, 1, updatedUser);
    return updatedUser;
}
export async function updateUserPut(
    id: string,
    payload: UpdateUserPutDto
): Promise<UserDto | undefined> {
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;

    const oldUser = users[index];
    if (!oldUser) {
        return undefined;
    }

    const updatedUser: UserDto = {
        id: oldUser.id,
        email: payload.email,
        passwordHash: payload.password ? await bcrypt.hash(payload.password, 10) : oldUser.passwordHash,
        role: oldUser.role,
        createdAt: oldUser.createdAt,
        updatedAt: new Date(),
    };

    users.splice(index, 1, updatedUser);

    return updatedUser;
}
export async function deleteUser(id: string): Promise<UserDto | undefined> {
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;

    const deletedUser = users[index];
    users.splice(index, 1);

    return deletedUser;
}

export async function ifUserExist(email: string): Promise<boolean> {
    return users.some((user : UserDto) => user.email === email.trim());
}