import {z} from "zod"

export const createUserSchemas = z.object({
    email: z.email("Не правильний формат").trim(),
    password: z.string().min(8, "Пароль має бути мінімум 8 символів").max(100, "Максимальна довжина 100 символів"),
}).strict();
export const paramsUserSchemas = z.object({ id: z.string() }).strict();

export const updateUserPatchSchemas = createUserSchemas.partial();
export const updateUserPutSchemas = createUserSchemas;