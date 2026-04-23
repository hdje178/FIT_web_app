import * as repository from '../repository/registration.repository.js';
import AppError from "../errors/api.errors.js";
import type {RegistrationDto, CreateRegistrationDto, RegistrationResponseDto, UpdateRegistrationPutDto,UserRegistrationsDto, UpdateRegistrationPatchDto, ParamsRegistrationDto} from "../dto/registrations.dto.js";
import {v4 as uuid4} from "uuid";
import type {Paginated} from "../types/pagineted.type.js";
export function registrationErrorHandler(err:any):never{
    if (err.code === "SQLITE_CONSTRAINT") {
        if(err.message.includes("NOT NULL")){
            const field = err.message.split(": ")[2];
            throw new AppError( 400, "BAD_REQUEST", `Field ${field} is required`)
        }
        if(err.message.includes("UNIQUE")){
            const field = err.message.split(": ")[2];
            throw new AppError( 409, "CONFLICT", "You`ve already registered for this event")
        }
        if(err.message.includes("FOREIGN KEY")){
            const field = err.message.split(": ")[2];
            throw new AppError( 404, "NOT_FOUND", "Event or user with that id not found")
        }
    }
    if (err.code === "SQLITE_CONSTRAINT_NOTNULL") {
        throw new AppError(400, "BAD_REQUEST", "Missing required fields");
    }
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE" && err.message.includes("user_id") && err.message.includes("event_id")) {
        throw new AppError(409, "CONFLICT", "You`ve already registered for this event");
    }
    if (err.code === "SQLITE_CONSTRAINT_PRIMARYKEY") throw new AppError(409, "CONFLICT", "Primary key conflict");
    if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
        throw new AppError(409, "CONFLICT", "Foreign key constraint failed");
    }
    if (err.code === "SQLITE_BUSY" || err.code === "SQLITE_LOCKED") {
        throw new AppError(503, "SERVER_ERROR", "Database busy, try again later");
    }
    throw new AppError(500, "SERVER_ERROR", "Internal server error");
}
export async function getRegistrations(): Promise<Paginated<RegistrationDto>> {
    const users = await repository.getRegistrations();
    return users
}
export async function getRegistrationById(id: number): Promise<RegistrationDto> {
    const user = await repository.getRegistrationById(id);
    if (!user) {
        throw new AppError(404, "NOT_FOUND", "User with that id not found", id);
    }
    return user;
}

export async function addRegistration(payload: CreateRegistrationDto): Promise<RegistrationDto> {
    const registration: CreateRegistrationDto = {
        userId: payload.userId,
        eventId: payload.eventId,
        status: "pending",
        description: payload.description ?? undefined,
    };
    const registrationFromDb = await repository.addRegistration(registration);
    if (!registrationFromDb) {
        throw new AppError(500, "SERVER_ERROR", "Retrieval failed");
    }
    return registrationFromDb;
}
export async function updateRegistrationPatch(
    id: number,
    payload: UpdateRegistrationPatchDto
): Promise<RegistrationDto> {

    if (!payload || Object.keys(payload).length === 0) {
        throw new AppError(400, "BAD_REQUEST", "Empty update body");
    }

    await repository.updateRegistrationPatch(id, payload);


    const registration =  await getRegistrationById(id);
    if (!registration) {
        throw new AppError(404, "NOT_FOUND", "Registration with that id not found", id);
    }
    return registration;
}
export async function updateRegistrationPut(
    id: number,
    payload: UpdateRegistrationPutDto
): Promise<RegistrationDto> {
    if (!payload || Object.keys(payload).length === 0) {
        throw new AppError(400, "BAD_REQUEST", "Empty update body");
    }

    await repository.updateRegistrationPut(id, payload);

    const registration =  await getRegistrationById(id);
    if (!registration) {
        throw new AppError(404, "NOT_FOUND", "Registration with that id not found", id);
    }
    return registration;
}
export async function deleteRegistration(id: number): Promise<RegistrationDto | boolean> {
    const registration = await repository.deleteRegistration(id);
    if (!registration) {
        throw new AppError(404, "NOT_FOUND", "Registration with that id not found", id);
    }
    return true;
}