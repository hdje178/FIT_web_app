import * as repository from "../repository/event.repository.js";
import type {
    EventItemsDto,
    CreateEventDto,
    UpdateEventPatchDto,
    QueryEventDto, UpdateEventPutDto, UnsafeEventRow,
} from "../dto/event.dto.js";
import AppError from "../errors/api.errors.js";
import { v4 as uuid4 } from "uuid";
import type {Paginated} from "../types/pagineted.type.js";
export function eventErrorHandler(err: any):never {
    if (err.code === "SQLITE_CONSTRAINT") {
        if(err.message.includes("NOT NULL")){
            const field = err.message.split(": ")[2];
            throw new AppError( 400, "BAD_REQUEST", `Field ${field} is required`)
        }
        if(err.message.includes("UNIQUE")){
            const field = err.message.split(": ")[2];
            throw new AppError( 409, "CONFLICT", `That name is already exist`)
        }
        if(err.message.includes("FOREIGN KEY")){
            const field = err.message.split(": ")[2];
            throw new AppError( 409, "CONFLICT", `Event is used and cannot be deleted`)
        }
    }
    if (err.code === "SQLITE_CONSTRAINT_NOTNULL") {
        throw new AppError(400, "BAD_REQUEST", "Missing required fields");
    }
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE" && err.message.includes("name")) {
        throw new AppError(409, "CONFLICT", "User with that name already exist");
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

export async function addEvent(payload: CreateEventDto): Promise<EventItemsDto> {
  const event = await repository.addEvent(payload)
  if (!event) {
      throw new AppError(500, "SERVER_ERROR", "Retrieval failed");
  }
  return event;
}
export async function getEventByID(
  id: number,
): Promise<EventItemsDto | undefined> {
  const event = await repository.getEventById(id);
  if (!event) {
      throw new AppError(404, "NOT_FOUND", "Event with that id not found", id);
  }
  return event;
}
export async function getRegistrationsCount(eventId: number) {
    return { count: await repository.getRegistrationsCount(eventId) };
}
export async function unsafeSearchById(search: string) {
    if (!search) {
        throw new AppError(400, "BAD_REQUEST", "Name is required");
    }
    return repository.unsafeGetEventById(String(search?? ""));
}
export async function getEvents(query: QueryEventDto): Promise<Paginated<EventItemsDto>> {
  let events = await repository.getEvents(query);
    if (!events)
        throw new AppError(404, "NOT_FOUND", "Events not found");
  return events;
}
export async function updateEventPatch(
  id: number,
  payload: UpdateEventPatchDto,
) {
    if (!payload || Object.keys(payload).length === 0) {
        throw new AppError(400, "BAD_REQUEST", "Empty update body");
    }

    const result = await repository.updateEventPatch(id, payload);
    console.log(result.changes, "changes");
    const event = await repository.getEventById(id);
    if (!event) {
        throw new AppError(404, "NOT_FOUND", "Event with that id not found", id);
    }
    return event;
}
export async function updateEventPut(
    id: number,
    payload: UpdateEventPutDto,
) {
    if (!payload || Object.keys(payload).length === 0) {
        throw new AppError(400, "BAD_REQUEST", "Empty update body");
    }
    await repository.updateEventPut(id, payload);
    const event = await repository.getEventById(id);
    if (!event) {
        throw new AppError(404, "NOT_FOUND", "Event with that id not found", id);
    }
    return event;
}
export async function deleteEvent(id: number): Promise<EventItemsDto | boolean> {
  const event = await repository.deleteEvent(id);
  if (!event)
    throw new AppError(404, "NOT_FOUND", "Event with that id not found", id);
  return true;
}
