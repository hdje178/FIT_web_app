import type { Request, Response, Express } from "express";
import * as service from "../service/event.service.js";
import type {
    CreateEventDto,
    EventItemsDto,
    ParamsEventDto,
    EventResponseDto, UpdateEventPatchDto, UpdateEventPutDto,
} from "../dto/event.dto.js";
import { mapEventToView } from "../dto/dto.func.js";

export async function addEventController(req: Request, res: Response) {
  const body = res.locals.validated.body as CreateEventDto;
  const event: EventItemsDto = await service.addEvent(body);
  const viewEvent: EventResponseDto = mapEventToView(event);
  res.status(201).json(viewEvent);
}
export async function getEventByIDController(req: Request, res: Response) {
  const params = res.locals.validated.params as ParamsEventDto;
  const event = await service.getEventByID(params.id);
  if (event) {
    const viewEvent: EventResponseDto = mapEventToView(event);
    res.status(200).json(viewEvent);
  }
}
export async function getEventRegistrationsCountController(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await service.getRegistrationsCount(id);
    res.status(200).json(result);
}
export async function unsafeSearchEventsController(req: Request, res: Response) {
    const id = String(req.params.id);
    const rows = await service.unsafeSearchById(id);
    res.status(200).json({data: rows, total: rows.length});
}
export async function getEventsController(req: Request, res: Response) {
  const query = res.locals.validated.query;
  const { data, total } = await service.getEvents(query);
  const viewEvents: EventResponseDto[] = data.map(mapEventToView);
  res.status(200).json({ data: viewEvents, total });
}
export async function updateEventPatchController(req: Request, res: Response) {
  const params = res.locals.validated.params as ParamsEventDto;
  const body = res.locals.validated.body as UpdateEventPatchDto;
  const event = await service.updateEventPatch(params.id, body);
  if (event) {
    const viewEvent: EventResponseDto = mapEventToView(event);
    res.status(200).json(viewEvent);
  }
}
export async function updateEventPutController(req: Request, res: Response) {
    const params = res.locals.validated.params as ParamsEventDto;
    const body = res.locals.validated.body as UpdateEventPutDto;

    const event = await service.updateEventPut(params.id, body);

    const viewEvent: EventResponseDto = mapEventToView(event);
    res.status(200).json(viewEvent);
}
export async function deleteEventController(req: Request, res: Response) {
  const params = res.locals.validated.params as ParamsEventDto;
  const event = await service.deleteEvent(params.id);
  if (event) {
    res.status(204).send();
  }
}
