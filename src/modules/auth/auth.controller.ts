import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utilies/response";
import { authService } from "./auth.service";

export const signup = async (req: Request, res: Response) => {
  const result = await authService.createUserIntoDB(req.body);
//   console.log(result.rows[0]);
  const { name, email, password, role } = result.rows[0];
  if (!["contributor", "maintainer"].includes(role)) {
    return sendError(res, "Role must be contributor or maintainer", null, 400);
  }
  try {
    sendSuccess(res, "User registered successfully", result.rows[0], 201);
  } catch (error: unknown) {
    if (error instanceof Error) {
      sendError(res, error.message, null, 400);
    }
  }
};

export const authController = {
  signup,
};
