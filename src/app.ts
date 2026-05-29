import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

const app: Application = express();
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send("Server is running fine");
});

app.use(globalErrorHandler);

export default app;
