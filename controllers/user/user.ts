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

    const {
      first_name,
      last_name,
      email,
      birth_date,
      phone_number,
      profile_complete,
    } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != id) return res.status(401).json("Unauthorized");

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

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != id) return res.status(401).json("Unauthorized");

    const userProfile = await prisma.user.findUnique({
      where: {
        id,
      }
    })
    



    res.status(200).json(userProfile);
  } catch (e) {
    res.status(500).json(e);
  }
};
