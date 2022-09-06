import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import User from "../../models/User";

import { handleTokenVerification } from "../authentication/authentication";

export const updateUser = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json("Missing fields");

    const {
      first_name,
      last_name,
      email,
      birth_date,
      phone_number,
      profile_complete,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !birth_date ||
      !phone_number ||
      !profile_complete
    )
      return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != id) return res.status(401).json("Unauthorized");

    const oldUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!oldUser) return res.status(404).json("User does not exist");

    if (oldUser.email != email) {
      const newAuth = await prisma.auth.update({
        where: {
          email: oldUser.email,
        },
        data: {
          email,
        },
      });
    }

    const userProfile = await prisma.user.update({
      where: {
        id,
      },
      data: {
        first_name,
        last_name,
        email,
        birth_date,
        phone_number,
        profile_complete,
      },
    });

    res.status(200).json(userProfile);
  } catch (e) {
    res.status(500).json(e);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json("Missing fields");

    const { logged_in_id } = req.headers;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const userProfile = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        pets: true,
        appointments: true,
      },
    });

    res.status(200).json(userProfile);
  } catch (e) {
    res.status(500).json(e);
  }
};
