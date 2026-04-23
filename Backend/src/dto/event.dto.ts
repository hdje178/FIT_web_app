import {
    type createEventSchema,
    type updateEventPatchSchema,
    type paramsEventSchema,
    type queryEventSchema, updateEventPutSchema,
} from "../schemas/event.schemas.js";
import {number, string, z} from "zod";

export interface EventItemsDto {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  date: Date;
  location: string;
  capacity: number;
  description: string;
}
export interface EventDbDto{
    event_id: number;
    name: string;
    date: Date;
    location: string;
    capacity: number;
    description: string;
    created_at: string;
    updated_at: string;
}
export type UnsafeEventRow = {
    event_id: number;
    name: string;
    date: string;
    location: string;
    capacity: number;
    description: string;
};
export interface EventResponseDto {
  id: number;
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