import type { Response } from "express";

export function sendSuccess<T>(
  res: Response,
  message: unknown,
  data: T,
  status = 200,
): void {
  res.status(status).json({
    success: true,
    message: message,
    data: data,
  });
}

export function sendError<T>(
  res: Response,
  message: unknown,
  errors: unknown = null,
  status = 500,
): void {
  res.status(status).json({
    success: false,
    message: message,
    errors: errors 
  });
}
