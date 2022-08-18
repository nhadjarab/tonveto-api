import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";

const prisma = new PrismaClient();

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/register", async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
  }
});

app.listen(port || 3005, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${port || 3005}`
  );
});
dotenv.config();
