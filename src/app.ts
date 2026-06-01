import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { authRouter } from "./modules/auth/auth.routes";
import { issueRouter } from "./modules/issues/issues.routes";
import CookieParser from "cookie-parser"

const app: Application = express();
app.use(CookieParser())
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send("Server is running fine");
});

app.use("/api/issues", issueRouter);
app.use("/api/auth", authRouter);

app.use(globalErrorHandler);

export default app;
