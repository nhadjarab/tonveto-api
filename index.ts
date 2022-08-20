import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";

// Methods import
import { register, login, registerVet, loginVet } from "./controllers/authentication/authentication";
import { getUser, updateUser } from "./controllers/user/user";
import { addPet, deletePet, getPet, updatePet } from "./controllers/pet/pet";
import { addAppointment, cancelAppointments, getAppointment, updateAppointment } from "./controllers/appointment/appointment";
import { getVet, updateVet } from "./controllers/vet/vet";

const prisma = new PrismaClient();

dotenv.config();

const app: Express = express();
app.use(express.json());

const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// ===========AUTHENTICATION ROUTES============

app.post("/register", async (req: Request, res: Response) => {
  try {
    register(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/registerVet", async (req: Request, res: Response) => {
  try {
    registerVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    login(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/loginVet", async (req: Request, res: Response) => {
  try {
    loginVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// ===========USER ROUTES============

app.get("/user/:id", async (req: Request, res: Response) => {
  try {
    getUser(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/user/:id", async (req: Request, res: Response) => {
  try {
    updateUser(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// ===========Vet ROUTES============

app.get("/vet/:id", async (req: Request, res: Response) => {
  try {
    getVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/vet/:id", async (req: Request, res: Response) => {
  try {
    updateVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// ===========Pet ROUTES============
app.post("/pet", async (req: Request, res: Response) => {
  try {
    addPet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/pet/:id", async (req: Request, res: Response) => {
  try {
    updatePet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.get("/pet/:id", async (req: Request, res: Response) => {
  try {
    getPet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/pet/:id", async (req: Request, res: Response) => {
  try {
    deletePet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// ===========Appointment ROUTERS============
app.post("/appointment", async (req: Request, res: Response) => {
  try {
    addAppointment(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/appointment/:id", async (req: Request, res: Response) => {
  try {
    updateAppointment(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.get("/appointment/:id", async (req: Request, res: Response) => {
  try {
    getAppointment(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/appointment/:id", async (req: Request, res: Response) => {
  try {
    cancelAppointments(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.listen(port || 3005, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${port || 3005}`
  );
});
