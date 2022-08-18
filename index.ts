import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import dotenv from "dotenv";

// Methods import
import { register, login } from "./controllers/authentication/authentication";

const prisma = new PrismaClient();

dotenv.config();

const app: Express = express();
app.use(express.json());

const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/register", async (req: Request, res: Response) => {
  register(req, res, prisma);
});

app.post("/login", async (req: Request, res: Response) => {
  login(req, res, prisma);
});

app.listen(port || 3005, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${port || 3005}`
  );
});

