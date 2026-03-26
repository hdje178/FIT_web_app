import {  z } from "zod";
import {createRegistrationSchema, updateRegistrationPutSchema, updateRegistrationPatchSchema} from "../schemas/registration.schema.js";
import type {paramsEventSchema} from "../schemas/event.schemas.js";

export interface RegistrationDto {
    id: string;
    userId: string;
    eventId: string;
    createdAt: Date;
    status: "pending" | "confirmed" | "canceled";
    updatedAt: Date;
    description?: string | "" | undefined;
}
export interface RegistrationResponseDto {
    id: string;
    userId: string;
    status: "pending" | "confirmed" | "canceled";
    eventId: string;
}
export type CreateRegistrationDto = z.infer<typeof createRegistrationSchema>;
export type UpdateRegistrationPutDto = z.infer<typeof updateRegistrationPutSchema>;
export type UpdateRegistrationPatchDto = z.infer<typeof updateRegistrationPatchSchema>;
export type ParamsRegistrationDto = z.infer<typeof paramsEventSchema>;