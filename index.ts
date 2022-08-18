import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import dotenv from "dotenv";

const prisma = new PrismaClient();

dotenv.config();

const app: Express = express();
app.use(express.json());

const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const hash = bcrypt.hashSync(password, 10);
  console.log("hash", hash);

  prisma.auth
    .create({
      data: {
        email,
        passwordHash: hash,
      },
    })
    .then(() => {
      prisma.user
        .create({
          data: {
            email,
            birth_date: new Date().toString(),
            first_name: "",
            last_name: "",
            phone_number: "",
          },
        })
        .finally(() => {
          res.status(200).json("User created");
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    })
    .catch((e) => {
      res.status(500).json("User not created");
    });
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userAth = await prisma.auth.findUnique({
      where: {
        email,
      },
    });

    if (!userAth) return res.status(404).json("User Not Found");

    const isValid = bcrypt.compareSync(password, userAth.passwordHash);

    if (!isValid) return res.status(401).json("Wrong password");

    // TODO: Generate JWT token

    const userProfile = await prisma.user.findUnique({
      where: {
        email,
      },
    });



    res.status(200).json(userProfile);
  } catch (e) {
    res.status(500).json(e);
  }
});

app.listen(port || 3005, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${port || 3005}`
  );
});
dotenv.config();
