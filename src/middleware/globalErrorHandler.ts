import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utilities/response";

export const globalErrorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const message =
    error instanceof Error ? error.message : "Internal Server Error";

  sendError(res, message, null, 500);
};
