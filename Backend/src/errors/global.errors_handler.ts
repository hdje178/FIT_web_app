import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import AppError from "./api.errors.js";

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
  console.error(err);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "server isn`t answering",
      details: null,
    },
  });
};
