import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import AppError from "./api.errors.js";
import {userErrorHandler} from "../service/user.service.js";
import {eventErrorHandler} from "../service/event.service.js";
import {registrationErrorHandler} from "../service/registration.service.js";
export const globalErrorHandler: ErrorRequestHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.log(err);

    if (err instanceof AppError) {
        return res.status(err.status).json({
            error: {
                code: err.code,
                message: err.message,
                details: err.details ?? null,
            },
        });
    } else if (err instanceof SyntaxError && "body" in err) {
        console.log(err.body ?? null);
        return res.status(400).json({
            error: {
                code: "BAD_REQUEST",
                message: "Request body contains invalid JSON",
                details: {
                    parseError: err.message,
                },
            },
        });
    }

    try {
        if (req.path.includes("/users")) {
            userErrorHandler(err);
        } else if (req.path.includes("/events")) {
            eventErrorHandler(err);
        }else if (req.path.includes("/registrations")) {
            registrationErrorHandler(err)
        }
    } catch (caughtErr: any) {
        console.log(caughtErr)
        return res.status(caughtErr.status).json({
            error: {
                code: caughtErr.code,
                message: caughtErr.message,
                details: caughtErr.details ?? null,
            }
        });
    }
};