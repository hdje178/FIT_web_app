import { z } from "zod";


export const createRegistrationSchema = z.object({
    userId: z.string("Не правильний формат").min(1, "User ID обов'язковий"),
    eventId: z.string("Не правильний формат").min(1, "Event ID обов'язковий"),
    status : z.enum(["pending", "confirmed", "canceled"], "Не правильний формат" ),
    description: z.string("Не правильний формат").max(200, "Перевищено ліміт символів(200)").default("").optional()
});
export const updateRegistrationPutSchema = z.object({
    status: z.enum(["pending", "confirmed", "canceled"], "Невірний статус"),
    description: z.string("Не правильний формат").max(200, "Перевищено ліміт символів(200)")
});
export const updateRegistrationPatchSchema = updateRegistrationPutSchema.partial();
export const paramsRegistrationSchema = z.object({ id: z.string() }).strict();