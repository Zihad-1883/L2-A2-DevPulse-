import type { TJwtPayload } from "../modules/auth/auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: TJwtPayload;
    }
  }
}
