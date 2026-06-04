import { z } from "zod";

function parseYMDToUTC(val: string): Date | null {
    const m = val.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    const date = new Date(Date.UTC(y, mo - 1, d));
    const valid =
        !isNaN(date.getTime()) &&
        date.getUTCFullYear() === y &&
        date.getUTCMonth() === mo - 1 &&
        date.getUTCDate() === d;
    return valid ? date : null;
}

function todayMidnightUTC(): Date {
    const t = new Date();
    t.setUTCHours(0, 0, 0, 0);
    return t;
}
export const createEventSchema = z.object({
  name: z
    .string("Неправильний формат")
    .trim()
    .min(1, "Поле обов'язкове")
    .max(50, "Перевищено ліміт символів(50)"),
    date: z
        .string("Неправильний формат")
        .refine((val) => {
            const d = parseYMDToUTC(val);
            if (!d) return false;
            return d.getTime() >= todayMidnightUTC().getTime();
        }, "Не можна планувати на минуле")
        .transform((val) => {
            const d = parseYMDToUTC(val);
            if (!d) throw new Error("Invalid date");
            return d.toISOString();
        }),
  location: z
    .string("Неправильний формат")
    .trim()
    .min(1, "Поле обов'язкове")
    .max(50, "Перевищено ліміт символів(50)"),
  capacity: z.coerce
    .number("Неправильний формат")
    .min(1, "Мінімум 1")
    .max(200, "Перевищено ліміт символів(200)"),
  description: z
    .string("Неправильний формат")
    .trim()
    .min(1, "Поле обов'язкове")
    .max(200, "Перевищено ліміт символів(200)"),
}).strict();

export const paramsEventSchema =  z.object({
    id: z.string()
}).strict().transform((data) => ({
    id: Number(data.id)
}));
export const queryEventSchema = z.object({
  limit: z.coerce
    .number("Неправильний формат")
    .int()
    .min(1, "Поле обов'язкове")
    .max(100, "Перевищено ліміт символів(100)")
    .default(20),
  offset: z.coerce
    .number("Неправильний формат")
    .int()
    .min(0, "Не може бути менше 0")
    .default(0),
  search: z.string("Неправильний формат").optional(),
  sortBy: z
    .enum(
      ["number_sorter", "name_sorter", "capacity_sorter", "date_sorter"],
      "Неправильний формат",
    ).catch("number_sorter")
    .optional()
    .default("number_sorter"),
}).strict();
export const updateEventPatchSchema = createEventSchema.partial();
export const updateEventPutSchema = createEventSchema;
