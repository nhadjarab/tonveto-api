import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import User from "../../models/User";

import { handleTokenVerification } from "../authentication/authentication";

export const updateVet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    const {
      email,
      birth_date,
      first_name,
      last_name,
      phone_number,
      bank_details,
      identification_order,
      profile_complete,
    } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != id) return res.status(401).json("Unauthorized");

    const vetProfile = await prisma.vet.update({
      where: {
        id,
      },
      data: {
        first_name,
        last_name,
        email,
        birth_date,
        phone_number,
        bank_details,
        identification_order,
        profile_complete,
      },
    });

    res.status(200).json(vetProfile);
  } catch (e) {
    res.status(500).json(e);
  }
};

export const getVet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;
    const { logged_in_id } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const vetProfile = await prisma.vet.findUnique({
      where: {
        id,
      },
      include: {
        specialities: true,
        appointments: true,
        calendar: true,
        clinics: {
          include: { clinic: true },
        },
      },
    });

    res.status(200).json(vetProfile);
  } catch (e) {
    res.status(500).json(e);
  }
};
