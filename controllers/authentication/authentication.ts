import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import fs from "fs";

import { verify, sign, JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../models/User";
import path from "path";

const private_key = fs.readFileSync(__dirname + "/vetolib.rsa");
const public_key = fs.readFileSync(__dirname + "/vetolib.rsa.pub");

export const register = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  const { email, password } = req.body;

  const hash = bcrypt.hashSync(password, 10);

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
};

export const registerVet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  const { email, password } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  prisma.auth
    .create({
      data: {
        email,
        passwordHash: hash,
      },
    })
    .then(() => {
      prisma.vet
        .create({
          data: {
            email,
            birth_date: new Date().toString(),
            first_name: "",
            last_name: "",
            phone_number: "",
            bank_details: "",
            identification_order: 0,
          },
        })
        .finally(() => {
          res.status(200).json("Vet created");
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    })
    .catch((e) => {
      res.status(500).json("Vet not created");
    });
};

export const login = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
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

    const userProfile = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        pets: true,
      },
    });

    const jwtToken = generateToken(userProfile?.id as string);

    res.status(200).json({ userProfile, jwtToken });
  } catch (e) {
    res.status(500).json(e);
  }
};

export const loginVet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { email, password } = req.body;
    const userAth = await prisma.auth.findUnique({
      where: {
        email,
      },
    });

    if (!userAth) return res.status(404).json("Vet Not Found");

    const isValid = bcrypt.compareSync(password, userAth.passwordHash);

    if (!isValid) return res.status(401).json("Wrong password");

    const vetProfile = await prisma.vet.findUnique({
      where: {
        email,
      },
      include: {
        appointments: true,
        specialities: true,
      },
    })!;

    const jwtToken = generateToken(vetProfile?.id as string);

    res.status(200).json({ vetProfile, jwtToken });
  } catch (e) {
    res.status(500).json(e);
  }
};

export const generateToken = (userId: string): string => {
  return sign({ userId }, private_key, { algorithm: "RS256" });
};

export const verifyToken = (token: string) => {
  return verify(token, public_key, { algorithms: ["RS256"] });
};

export const handleTokenVerification = (req: Request, res: Response) => {
  const token = req?.headers["authorization"]?.split(" ")[1];

  let payload;

  if (!token) return res.status(401).end();

  try {
    payload = verifyToken(token);

    return payload;
  } catch (e) {
    if (e instanceof JsonWebTokenError) return res.status(401).end();
    return res.status(400).end();
  }
};
