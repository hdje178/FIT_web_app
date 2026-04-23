import { z } from "zod";
import AppError from "../errors/api.errors.js";
import type { Request, Response, NextFunction, RequestHandler } from "express";
type ValidationSchemas = {
  params?: z.ZodTypeAny;
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
};

export function validate({
  params,
  body,
  query,
}: ValidationSchemas): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const validated: {
      params?: unknown;
      body?: unknown;
      query?: unknown;
    } = {};
    if (params) {
      const validParams = params.safeParse(req.params);
      if (!validParams.success) {
          return next(AppError.validation("Validation error", z.treeifyError(validParams.error)));
      }
      validated.params = validParams.data;
    }

    if (body) {
        if(req.body === undefined) {
        return next(AppError.badRequest("Body is required"));
    }
      const validBody = body.safeParse(req.body);
        console.log(" validBody.success:", validBody.success);
        console.log(" validBody.data:", validBody.data);
      if (!validBody.success) {
          return next(AppError.validation("Validation error", z.treeifyError(validBody.error)));
      }

      validated.body = validBody.data;
    }
    if (query) {
      const validQuery = query.safeParse(req.query);
      if (!validQuery.success) {
          return next(AppError.validation("Validation error", z.treeifyError(validQuery.error)));
      }
      validated.query = validQuery.data;
    }
    res.locals.validated = validated;
    next();
  };
}
