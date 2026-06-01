import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utilities/response";
import { authService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  //   console.log(result.rows[0]);
  try {
    const result = await authService.createUserIntoDB(req.body);
    return sendSuccess(
      res,
      "User registered successfully",
      result.rows[0],
      201,
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return sendError(res, error.message, error, 400);
    }
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    const { refreshToken } = result;
    res.cookie("refresh_token", refreshToken, {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    });
    return sendSuccess(res, "Login successful", result, 200);
  } catch (error) {
    if (error instanceof Error) {
      return sendError(res, error.message, error, 400);
    }
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const result = await authService.generateRefreshToken(
      req.cookies.refresh_token,
    );
    return sendSuccess(res, "Access token generated", result, 200);
  } catch (error) {
    if (error instanceof Error) {
      return sendError(res, error.message, error, 500);
    }
  }
};

export const authController = {
  signup,
  login,
  refreshToken,
};
