import { v4 as uuid4 } from "uuid";
import type {EventItemsDto, UpdateEventPatchDto, UpdateEventPutDto} from "../dto/event.dto.js";

export const events: EventItemsDto[] = [
  {
    id: "1",
    name: "Event 1",
    date: new Date("2027-01-01"),
    createdAt: new Date("2027-01-01"),
    updatedAt: new Date("2027-01-01"),
    location: "Location 1",
    capacity: 100,
    description: "Description 1",
  },
  {
    id: "2",
    name: "Event 2",
    date: new Date("2027-01-02"),
    createdAt: new Date("2027-01-01"),
    updatedAt: new Date("2027-01-01"),
    location: "Location 2",
    capacity: 200,
    description: "Description 2",
  },
  {
    id: "3",
    name: "Event 3",
    date: new Date("2027-01-03"),
    createdAt: new Date("2027-01-01"),
    updatedAt: new Date("2027-01-01"),
    location: "Location 3",
    capacity: 500,
    description: "Description 3",
  },
  {
    id: "4",
    name: "Event 4",
    date: new Date("2027-01-04"),
    createdAt: new Date("2027-01-01"),
    updatedAt: new Date("2027-01-01"),
    location: "Location 4",
    capacity: 400,
    description: "Description 4",
  },
];
export async function getEvents(): Promise<EventItemsDto[]> {
  return events? structuredClone(events) : [];
}
export async function getEventById(
  id: string,
): Promise<EventItemsDto | undefined> {
  const event = events.find((event) => event.id === id);
  return event ? structuredClone(event) : undefined;
}
export async function addEvent(event: EventItemsDto): Promise<EventItemsDto> {
  await events.push(event);
  return event;
}
export async function updateEventPatch(
  id: string,
  payload: UpdateEventPatchDto,
): Promise<EventItemsDto | undefined> {
  const index = events.findIndex((event) => event.id === id);
  if (index === -1) return undefined;

  const oldEvent = events[index];
  if (!oldEvent) {
    return undefined;
  }

  const updatedEvent: EventItemsDto = {
    id: oldEvent.id,
    name: payload.name ?? oldEvent.name,
    date: payload.date ?? oldEvent.date,
    location: payload.location ?? oldEvent.location,
    capacity: payload.capacity ?? oldEvent.capacity,
    description: payload.description ?? oldEvent.description,
    createdAt: oldEvent.createdAt,
    updatedAt: new Date(),
  };

  events.splice(index, 1, updatedEvent);

  return updatedEvent;
}
export async function updateEventPut(
    id: string,
    payload: UpdateEventPutDto,
): Promise<EventItemsDto | undefined> {
    const index = events.findIndex(event => event.id === id);
    if (index === -1) return undefined;

    const oldEvent = events[index]!;

    const updatedEvent: EventItemsDto = {
        id: oldEvent.id,
        createdAt: oldEvent.createdAt,
        updatedAt: new Date(),
        name: payload.name,
        date: payload.date,
        location: payload.location,
        capacity: payload.capacity,
        description: payload.description,
    };

    events[index] = updatedEvent;

    return updatedEvent;
}
export async function deleteEvent(id: string): Promise<EventItemsDto | undefined> {
  const index = events.findIndex((event) => event.id === id);
  if (index === -1) {
    return undefined;
  }
  const deletedEvent = events[index];
  events.splice(index, 1);
  return deletedEvent;
}
export async function ifEventExist(name: string): Promise<boolean> {
  return events.some((event) => event.name === name);
}
