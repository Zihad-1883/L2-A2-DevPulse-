import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utilities/response";
import jwt from "jsonwebtoken";
import config from "../config";
import type { TJwtPayload } from "../modules/auth/auth.types";
import { pool } from "../db";
import type { TUserRole } from "../types";

const auth = (...role: TUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      // console.log(req.body);

      if (!token) {
        return sendError(res, "No Token Found", null, 401);
      }

      const decoded = jwt.verify(
        token as string,
        config.jwt_access_secret as string,
      ) as TJwtPayload;

      const userData = await pool.query(
        `
        SELECT * FROM users WHERE email=$1   
        `,
        [decoded.email],
      );

      if (userData.rowCount === 0) {
        return sendError(res, "User not found", null, 404);
      }

      const user = userData.rows[0];
      // console.log(user.role);

      if (!role.includes(user.role)) {
        return sendError(res, "Unauthorized Access", null, 403);
      }

      req.user = decoded;
      next();
    } catch (error) {
      // console.log("from auth");
      next(error);
    }
  };
};

export default auth;
