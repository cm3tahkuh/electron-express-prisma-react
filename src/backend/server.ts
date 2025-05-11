import express, { Request, Response } from "express";
const app = express();
import routes from "./routes/index";
import init from "./init";
import cors from "cors";

app.use(express.json());
app.use(cors());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("COCA COLA");
});

const PORT = 5555;

const startServer = async () => {
  await init();

  // Запуск сервера
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
