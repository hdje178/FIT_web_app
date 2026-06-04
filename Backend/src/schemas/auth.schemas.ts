import { z } from "zod";

export const loginSchema = z.object({
    email: z.string("Не правильний формат").email("Не правильний формат").trim(),
    password: z.string("Не правильний формат").min(8, "Введено менше 8 символів").max(50, "Введено більше 50 символів")
}).strict();