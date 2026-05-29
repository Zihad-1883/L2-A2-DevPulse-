import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { authRouter } from "./modules/auth/auth.routes";

const app: Application = express();
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send("Server is running fine");
});

app.use("/api/auth", authRouter);

app.use(globalErrorHandler);

export default app;
