import {
    type createEventSchema,
    type updateEventPatchSchema,
    type paramsEventSchema,
    type queryEventSchema, updateEventPutSchema,
} from "../schemas/event.schemas.js";
import {  z } from "zod";

export interface EventItemsDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  date: Date;
  location: string;
  capacity: number;
  description: string;
}
export interface EventResponseDto {
  id: string;
  name: string;
  date: Date;
  location: string;
  capacity: number;
  description: string;
}
export type CreateEventDto = z.infer<typeof createEventSchema>;
export type UpdateEventPatchDto = z.infer<typeof updateEventPatchSchema>;
export type ParamsEventDto = z.infer<typeof paramsEventSchema>;
export type QueryEventDto = z.infer<typeof queryEventSchema>;
export type UpdateEventPutDto = z.infer<typeof updateEventPutSchema>;