import * as repository from "../repository/event.repository.js";
import type {
    EventItemsDto,
    CreateEventDto,
    UpdateEventPatchDto,
    QueryEventDto, UpdateEventPutDto,
} from "../dto/event.dto.js";
import AppError from "../errors/api.errors.js";
import { v4 as uuid4 } from "uuid";

export async function addEvent(payload: CreateEventDto): Promise<EventItemsDto> {
  const event: EventItemsDto = { ...payload, id: uuid4(), createdAt: new Date(), updatedAt: new Date() };
  if (await repository.ifEventExist(event.name))
    throw new AppError(
      409,
      "CONFLICT",
      "Event with this name already exist",
      event,
    );
  return repository.addEvent(event);
}
export async function getEventByID(
  id: string,
): Promise<EventItemsDto | undefined> {
  const event = await repository.getEventById(id);
  if (!event) {
      throw new AppError(404, "NOT_FOUND", "Event with that id not found", id);
  }
  return event;
}
export async function ifEventExist(name: string): Promise<boolean> {
  return repository.ifEventExist(name);
}
export async function getEvents(
  query: QueryEventDto,
): Promise<{ items: EventItemsDto[]; total: number }> {
  let events = await repository.getEvents();
  if (query.search) {
    const search = query.search.toLowerCase();
    events = events.filter((e) => e.name.toLowerCase().includes(search));
  }
  const total: number = events.length;
  if (query.sortBy) {
    if (query.sortBy === "number_sorter") {
      events.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }
    if (query.sortBy === "name_sorter") {
      events.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (query.sortBy === "capacity_sorter") {
      events.sort((a, b) => a.capacity - b.capacity);
    }
    if (query.sortBy === "date_sorter") {
      events.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    }
  }

  events = events.slice(query.offset, query.offset + query.limit);

  return { items: events, total };
}
export async function updateEventPatch(
  id: string,
  payload: UpdateEventPatchDto,
): Promise<EventItemsDto | undefined> {
  const event = await repository.updateEventPatch(id, payload);
  if (!event)
    throw new AppError(404, "NOT_FOUND", "Event with that id not found", id);
  return event;
}
export async function updateEventPut(
    id: string,
    payload: UpdateEventPutDto,
): Promise<EventItemsDto> {
    const event = await repository.updateEventPut(id, payload);
    if (!event) {
        throw new AppError(404, "NOT_FOUND", "Event not found", id);
    }
    return event;
}
export async function deleteEvent(id: string): Promise<EventItemsDto | undefined> {
  const event = await repository.deleteEvent(id);
  if (!event)
    throw new AppError(404, "NOT_FOUND", "Event with that id not found", id);
  return event;
}
