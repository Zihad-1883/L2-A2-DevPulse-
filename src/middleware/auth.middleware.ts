import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utilities/response";
import jwt from "jsonwebtoken";
import config from "../config";
import type { TJwtPayload } from "../modules/auth/auth.types";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return sendError(res, "No Token Found", null, 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwt_secret) as TJwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
