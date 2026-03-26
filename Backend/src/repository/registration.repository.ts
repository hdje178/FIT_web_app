import type {RegistrationDto, RegistrationResponseDto, CreateRegistrationDto, UpdateRegistrationPutDto, UpdateRegistrationPatchDto} from "../dto/registrations.dto.js";
import { v4 as uuidv4 } from "uuid";


export const registrations: RegistrationDto[] = [
    {
        id: "1",
        userId: "1",
        eventId: "2",
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "2",
        userId: "2",
        eventId: "1",
        status: "confirmed",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "3",
        userId: "2",
        eventId: "3",
        status: "canceled",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export async function getRegistrations(): Promise<RegistrationDto[]> {
    return registrations ? structuredClone(registrations) : [];
}
export async function getRegistrationById(id: string): Promise<RegistrationDto | undefined> {
    const registration = registrations.find(registration => registration.id === id);
    return registration ? structuredClone(registration) : undefined;
}
export async function addRegistration(registration: RegistrationDto): Promise<RegistrationDto> {
    await registrations.push(registration);
    return registration;
}
export async function updateRegistrationPut(id: string, payload: UpdateRegistrationPutDto): Promise<RegistrationDto| undefined> {
    const index = registrations.findIndex(registration => registration.id === id);
    if (index === -1) return undefined;
    const oldregistration = registrations[index];
    if(!oldregistration){return undefined;}
    const updatedRegistration: RegistrationDto = {
        id: oldregistration.id,
        createdAt: oldregistration.createdAt,
        userId: oldregistration.userId,
        eventId: oldregistration.eventId,
        status: payload.status ,
        description: payload.description,
        updatedAt: new Date(),
    }
    registrations.splice(index, 1, updatedRegistration);
    return updatedRegistration;
}
export async function updateRegistrationPatch(id: string, payload: UpdateRegistrationPatchDto): Promise<RegistrationDto| undefined> {
    const index = registrations.findIndex(registration => registration.id === id);

    if (index === -1) return undefined;
    const oldregistration = registrations[index];
    if(!oldregistration){return undefined;}
    const updatedRegistration: RegistrationDto = {
        id: oldregistration.id,
        createdAt: oldregistration.createdAt,
        userId: oldregistration.userId,
        eventId: oldregistration.eventId,
        status: payload.status ?? oldregistration.status,
        description: payload.description !== undefined ? payload.description : oldregistration.description,
        updatedAt: new Date(),
    }
    registrations.splice(index, 1, updatedRegistration);
    return updatedRegistration;
}
export async function deleteRegistration(id: string): Promise<RegistrationDto | undefined> {
    const index = registrations.findIndex(registration => registration.id === id);
    if (index === -1) return undefined;
    const deletedRegistration = registrations[index];
    registrations.splice(index, 1);
    return deletedRegistration;
}