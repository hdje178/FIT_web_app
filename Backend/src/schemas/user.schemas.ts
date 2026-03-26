import { z } from "zod";

export const createUserSchemas = z
  .object({
    name: z.string({ message: "Не правильний формат" }).trim().min(1, "Ім'я обов'язкове").max(50, "Перевищено ліміт символів(50)"),
    email: z.string({ message: "Не правильний формат" }).email("Не правильний формат").trim(),
  })
  .strict();

export const paramsUserSchemas = z.object({ id: z.string() }).strict();

export const updateUserPatchSchemas = createUserSchemas.partial();
export const updateUserPutSchemas = createUserSchemas;