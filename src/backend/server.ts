const express = require("express");
import { Request, Response } from "express";
import { PrismaClient } from "./generated/prisma/";

const cors = require('cors')
const app = express();
const PORT = 3333;
const prisma = new PrismaClient();



app.use(express.json());
app.use(cors())

app.get("/", (req: any, res: any) => {
  res.send("Hello World from Express!");
});

app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
