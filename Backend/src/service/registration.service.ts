import * as repository from '../repository/registration.repository.js';
import AppError from "../errors/api.errors.js";
import type {RegistrationDto, CreateRegistrationDto, RegistrationResponseDto, UpdateRegistrationPutDto, UpdateRegistrationPatchDto, ParamsRegistrationDto} from "../dto/registrations.dto.js";
import {v4 as uuid4} from "uuid";

export async function getRegistrations(): Promise<{items: RegistrationDto[], total: number}> {
    const users = await repository.getRegistrations();
    return {items : users, total: users.length}
}
export async function getRegistrationById(id: string): Promise<RegistrationDto | undefined> {
    const user = await repository.getRegistrationById(id);
    if (!user) {
        throw new AppError(404, "NOT_FOUND", "User with that id not found", id);
    }
    return user;
}
export async function addRegistration(payload: CreateRegistrationDto): Promise<RegistrationDto> {
    const id: string = uuid4();
    const createdAt: Date = new Date();
    const updatedAt: Date = new Date();

    const registration: RegistrationDto = {
        id,
        userId: payload.userId,
        eventId: payload.eventId,
        status: "pending",
        description: payload.description ?? undefined,
        createdAt,
        updatedAt,
    };
    await repository.addRegistration(registration);
    return registration;
}
export async function updateRegistrationPatch(id: string, payload: UpdateRegistrationPatchDto): Promise<RegistrationDto | undefined> {
    const registration = await repository.updateRegistrationPatch(id, payload);
    if (!registration) {
        throw new AppError(404, "NOT_FOUND", "Registration with that id not found", id);
    }
    return registration;
}
export async function updateRegistrationPut(id: string, payload: UpdateRegistrationPutDto): Promise<RegistrationDto | undefined> {
    const registration = await repository.updateRegistrationPut(id, payload);
    if (!registration) {
        throw new AppError(404, "NOT_FOUND", "Registration with that id not found", id);
    }
    return registration;
}
export async function deleteRegistration(id: string): Promise<RegistrationDto | undefined> {
    const registration = await repository.deleteRegistration(id);
    if (!registration) {
        throw new AppError(404, "NOT_FOUND", "Registration with that id not found", id);
    }
    return registration;
}