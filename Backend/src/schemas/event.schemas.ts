import { z } from "zod";

export const createEventSchema = z.object({
  name: z
    .string("Неправильний формат")
    .trim()
    .min(1, "Поле обов'язкове")
    .max(50, "Перевищено ліміт символів(50)"),
  date: z
    .string("Неправильний формат") // рядок із форми
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date >= new Date();
    }, "Не можна планувати на минуле")
    .transform((val) => new Date(val)),
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

export const paramsEventSchema = z.object({
  id: z.uuid().or(z.string()), //для наглядності
}).strict();
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
    )
    .optional()
    .default("number_sorter"),
}).strict();
export const updateEventPatchSchema = createEventSchema.partial();
export const updateEventPutSchema = createEventSchema;
