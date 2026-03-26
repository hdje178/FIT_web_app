import type { AppErrorCode } from "../types/error.type.js";

export default class AppError extends Error {
  status: number;
  code: AppErrorCode;
  details?: unknown;
  constructor(
    status: number,
    code: AppErrorCode,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static notFound(message: string = "resource not found", details?: unknown) {
    return new AppError(404, "NOT_FOUND", message, details);
  }
  static badRequest(
    message: string = "request is not valid",
    details?: unknown,
  ) {
    return new AppError(400, "BAD_REQUEST", message, details);
  }
  static internalServerError(
    message: string = "server isn`t answering",
    details?: unknown,
  ) {
    return new AppError(500, "INTERNAL_ERROR", message, details);
  }
  static conflict(message: string = "conflict", details?: unknown) {
    return new AppError(409, "CONFLICT", message, details);
  }
  static validation(message: string = "validation failed", details?: unknown) {
    return new AppError(400, "VALIDATION_ERROR", message, details);
  }
}
