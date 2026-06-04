import * as service from "../service/registration.service.js"
import type {Request, Response, NextFunction} from "express";
import {mapRegistrationToView, mapUserToView} from "../dto/dto.func.js"
import * as userService from "../service/user.service.js";
import AppError from "../errors/api.errors.js";
import type {UserResponseDto} from "../dto/user.dto.js";
import type {RegistrationResponseDto} from "../dto/registrations.dto.js";



export async function getRegistrationController(req: Request, res: Response, next: NextFunction) {
    const {data, total} = await service.getRegistrations();
    const viewRegistrations = data.map(mapRegistrationToView);
    res.status(200).json({data: viewRegistrations, total});
}
export async function getRegistrationByIdController(req: Request, res: Response, next: NextFunction) {
    const params = res.locals.validated.params;
    const userId = (req as any).user.userId;
    const isAdmin = (req as any).user.role?.toLowerCase() === 'admin';

    const registration = await service.getRegistrationById(params.id);
    if (!registration) return next(new AppError(404, 'NOT_FOUND', 'Registration not found'));

    if (!isAdmin && registration.userId !== userId) {
        return next(new AppError(403, 'FORBIDDEN', 'You can only cancel your own registrations'));
    }
    if (registration) {
        const viewRegistration = mapRegistrationToView(registration);
        res.status(200).json(viewRegistration);
    }
}

export async function addRegistrationController(req: Request, res: Response, next: NextFunction) {
    const body = res.locals.validated.body;
    const userId = (req as any).user.userId;
    const registration = await service.addRegistration({ ...body, userId });
    const viewRegistration = mapRegistrationToView(registration);
    res.status(201).json(viewRegistration);
}
export async function updateRegistrationPatchController(req: Request, res: Response, next: NextFunction) {
    const params = res.locals.validated.params;
    const body = res.locals.validated.body;
    const userId = (req as any).user.userId;
    const isAdmin = (req as any).user.role?.toLowerCase() === 'admin';

    const check = await service.getRegistrationById(params.id);
    if (!check) return next(new AppError(404, 'NOT_FOUND', 'Registration not found'));

    if (!isAdmin && check.userId !== userId) {
        return next(new AppError(403, 'FORBIDDEN', 'You can only cancel your own registrations'));
    }
    const registration = await service.updateRegistrationPatch(params.id, body);
    if (registration) {
        const viewRegistration = mapRegistrationToView(registration)
        res.status(200).json(viewRegistration);
    }
}
export async function updateRegistrationPutController(req: Request, res: Response, next: NextFunction) {
    const params = res.locals.validated.params;
    const body = res.locals.validated.body;
    const userId = (req as any).user.userId;
    const isAdmin = (req as any).user.role?.toLowerCase() === 'admin';

    const check = await service.getRegistrationById(params.id);
    if (!check) return next(new AppError(404, 'NOT_FOUND', 'Registration not found'));

    if (!isAdmin && check.userId !== userId) {
        return next(new AppError(403, 'FORBIDDEN', 'You can only cancel your own registrations'));
    }
    const registration = await service.updateRegistrationPut(params.id, body);
    if (registration) {
        const viewRegistration = mapRegistrationToView(registration)
        res.status(200).json(viewRegistration);
    }
}
export async function deleteRegistrationController(req: Request, res: Response, next: NextFunction) {
    const params = res.locals.validated.params;
    const userId = (req as any).user.userId;
    const isAdmin = (req as any).user.role?.toLowerCase() === "admin" ;
    const registration = await service.getRegistrationById(params.id);
    if (!registration) return next(new AppError(404, 'NOT_FOUND', 'Registration not found'));

    if (!isAdmin && registration.userId !== userId) {
        return next(new AppError(403, 'FORBIDDEN', 'You can only cancel your own registrations'));
    }
    await service.deleteRegistration(params.id);
    res.status(204).send();
}
export async function getMyRegistration(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user.userId;
    const { data, total } = await service.getRegistrationsByUserId(userId);
    res.json({ data: data.map(mapRegistrationToView), total });
}