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

    if (!id) return res.status(400).json("Missing fields");

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

    if (
      !email ||
      !birth_date ||
      !first_name ||
      !last_name ||
      !phone_number ||
      !bank_details ||
      !identification_order ||
      !profile_complete
    )
      return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != id) return res.status(401).json("Unauthorized");

    const oldVet = await prisma.vet.findUnique({
      where: {
        id,
      },
    });

    if (!oldVet) return res.status(404).json("Vet does not exist");

    if (oldVet.email != email) {
      const newAuth = await prisma.auth.update({
        where: {
          email: oldVet.email,
        },
        data: {
          email,
        },
      });
    }

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

    if (!id) return res.status(400).json("Missing fields");

    const { logged_in_id } = req.headers;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id) {
      return res.status(401).json("Unauthorized");
    }

    const vetProfile = await prisma.vet.findUnique({
      where: {
        id,
      },
      include: {
        RatingVet: {},
        specialities: true,
        appointments: true,
        calendar: true,
        CommentVet: true,
        clinics: {
          include: { clinic: true },
        },
      },
    });

    if (!vetProfile) return res.status(404).json("Vet does not exist");

    const vetRating = await prisma.ratingVet.aggregate({
      where: {
        vet_id: id,
      },
      _avg: {
        rating: true,
      },
    });

    res.status(200).json({ vetProfile, vetRating });
  } catch (e) {
    res.status(500).json(e);
  }
};
