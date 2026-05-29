import express, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = express();
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.send("Server is running fine");
});

export default app;
