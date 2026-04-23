import {updateRegistrationPatchSchema, createRegistrationSchema, updateRegistrationPutSchema} from "../schemas/registration.schema.js";
import * as service from "../service/registration.service.js"
import type {Request, Response, NextFunction} from "express";
import {mapRegistrationToView} from "../dto/dto.func.js"



export async function getRegistrationController(req: Request, res: Response, next: NextFunction) {
    const {data, total} = await service.getRegistrations();
    const viewRegistrations = data.map(mapRegistrationToView);
    res.status(200).json({data: viewRegistrations, total});
}
export async function getRegistrationByIdController(req: Request, res: Response, next: NextFunction) {
    const params = res.locals.validated.params;
    const registration = await service.getRegistrationById(params.id);
    if (registration) {
        const viewRegistration = mapRegistrationToView(registration);
        res.status(200).json(viewRegistration);
    }
}

export async function addRegistrationController(req: Request, res: Response, next: NextFunction) {
    const body = res.locals.validated.body;
    const registration = await service.addRegistration(body);
    const viewRegistration = mapRegistrationToView(registration);
    res.status(201).json(viewRegistration);
}
export async function updateRegistrationPatchController(req: Request, res: Response, next: NextFunction) {
    const params = res.locals.validated.params;
    const body = res.locals.validated.body;
    const registration = await service.updateRegistrationPatch(params.id, body);
    if (registration) {
        const viewRegistration = mapRegistrationToView(registration)
        res.status(200).json(viewRegistration);
    }
}
export async function updateRegistrationPutController(req: Request, res: Response, next: NextFunction) {
    const params = res.locals.validated.params;
    const body = res.locals.validated.body;
    const registration = await service.updateRegistrationPut(params.id, body);
    if (registration) {
        const viewRegistration = mapRegistrationToView(registration)
        res.status(200).json(viewRegistration);
    }
}
export async function deleteRegistrationController(req: Request, res: Response, next: NextFunction) {
    const params = res.locals.validated.params;
    await service.deleteRegistration(params.id);
    res.status(204).send();
}