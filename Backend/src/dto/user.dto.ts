import { z } from "zod";
import { createUserSchemas, paramsUserSchemas, updateUserPutSchemas, updateUserPatchSchemas } from "../schemas/user.schemas.js";

export type UserDto ={
    id: number;
    name: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN";
    createdAt: string;
    updatedAt: string;
};
export type UserDbDto ={
    user_id: number;
    name: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN";
    created_at: string;
    updated_at: string;
}
export type UserResponseDto = {
    id: number;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
}
export type CreateUserDto = z.infer<typeof createUserSchemas>
export type UpdateUserPatchDto = z.infer<typeof updateUserPatchSchemas>
export type UpdateUserPutDto = z.infer<typeof updateUserPutSchemas>
export type ParamsUserDto = z.infer<typeof paramsUserSchemas>