import { z } from "zod";
import { createUserSchemas, paramsUserSchemas, updateUserPutSchemas, updateUserPatchSchemas } from "../schemas/user.schemas.js";

export type UserDto ={
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    createdAt: Date;
    updatedAt: Date;
};
export type UserResponseDto = {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
}
export type CreateUserDto = z.infer<typeof createUserSchemas>
export type UpdateUserPatchDto = z.infer<typeof updateUserPatchSchemas>
export type UpdateUserPutDto = z.infer<typeof updateUserPutSchemas>
export type ParamsUserDto = z.infer<typeof paramsUserSchemas>