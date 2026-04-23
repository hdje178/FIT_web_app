import * as service from "../service/user.service.js"
import type { Request, Response, NextFunction } from "express"
import type {ParamsUserDto, UserResponseDto, UpdateUserPutDto, UpdateUserPatchDto, UserDto, CreateUserDto} from "../dto/user.dto.js"
import {mapUserToView} from "../dto/dto.func.js"


export async function getUserByIdController(req: Request, res: Response, next: NextFunction) {
    const params = res.locals.validated.params as ParamsUserDto;
    const user = await service.getUserById(params.id);
    const viewUser: UserResponseDto = mapUserToView(user);
    res.status(200).json(viewUser);
}
export async function getUsersController(req: Request, res: Response, next: NextFunction) {
    const {data, total} = await service.getUsers();
    const viewUsers: UserResponseDto[] = data.map(mapUserToView);
    res.status(200).json({ data: viewUsers, total:total });
}
export async function getRegistrationByUserIdController(req: Request, res: Response, next: NextFunction) {
    const params = res.locals.validated.params;
    const userRegistration = await service.getUserRegistration(params.id)
    res.status(200).json(userRegistration);
}
export async function addUserController(req: Request, res: Response, next: NextFunction) {
    const body = res.locals.validated.body as CreateUserDto;
    const user: UserDto | null = await service.addUser(body);
    const viewUser: UserResponseDto = mapUserToView(user);
    res.status(201).json(viewUser);
}
export async function updateUserPatchController(req: Request, res: Response, next: NextFunction) {
    const params = res.locals.validated.params as ParamsUserDto;
    const body = res.locals.validated.body as UpdateUserPatchDto;
    const user = await service.updateUserPatch(params.id, body);
    const viewUser: UserResponseDto = mapUserToView(user);
    res.status(200).json(viewUser);

}
export async function updateUserPutController(req: Request, res: Response, next: NextFunction) {
    const params = res.locals.validated.params as ParamsUserDto;
    const body = res.locals.validated.body as UpdateUserPutDto;
    const user = await service.updateUserPut(params.id, body);
    const viewUser: UserResponseDto = mapUserToView(user);
    res.status(200).json(viewUser);

}
export async function deleteUserController(req: Request, res: Response, next: NextFunction) {
    const params = res.locals.validated.params as ParamsUserDto;
    await service.deleteUser(params.id);
    res.status(204).send();
}
