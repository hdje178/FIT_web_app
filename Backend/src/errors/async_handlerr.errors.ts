import type { Request, Response, NextFunction } from "express";

export function asyncHandler(fn: Function) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await fn(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}
