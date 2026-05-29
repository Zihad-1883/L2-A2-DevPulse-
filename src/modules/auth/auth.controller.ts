import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../../utilies/response";
import { authService } from "./auth.service";

export const signup = async (req: Request, res: Response) => {
  const result = await authService.createUserIntoDB(req.body);
  console.log(result.rows[0]);
};

export const authController = {
  signup,
};

// export const signup = async (req: Request, res: Response) => {
//   const { name, email, password, role } = req.body;
//   if (!name || !email || !password || !role) {
//     return sendError(res, "All fields are required", null, 400);
//   }

//   const user = await authService.createUserIntoDB({
//     name,
//     email,
//     password,
//     role,
//   });

//   return sendSuccess(res, "User registered successfully", user, 201);
// };
