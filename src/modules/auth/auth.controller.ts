import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utilities/response";
import { authService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  //   console.log(result.rows[0]);
  try {
    const result = await authService.createUserIntoDB(req.body);
    sendSuccess(res, "User registered successfully", result.rows[0], 201);
  } catch (error: unknown) {
    if (error instanceof Error) {
      sendError(res, error.message, error, 400);
    }
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    sendSuccess(res, "Login successful", result, 200);
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, error.message, error, 400);
    }
  }
};

export const authController = {
  signup,
  login,
};
