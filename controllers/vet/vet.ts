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
    } = req.body;

    if (
      email == undefined ||
      birth_date == undefined ||
      first_name == undefined ||
      last_name == undefined ||
      phone_number == undefined ||
      bank_details == undefined ||
      identification_order == undefined
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
      const doesAuthExist = await prisma.auth.findUnique({
        where: {
          email,
        },
      });

      if (doesAuthExist)
        return res.status(400).json("Email already being used");

      const newAuth = await prisma.auth.update({
        where: {
          email: oldVet.email,
        },
        data: {
          email,
        },
      });
    }

    const doesVetWithIdentificationOrderExist = await prisma.vet.findFirst({
      where: {
        identification_order,
      },
    });

    if (
      doesVetWithIdentificationOrderExist &&
      doesVetWithIdentificationOrderExist.id != id
    )
      return res
        .status(400)
        .json("A vet with identification order already exists");

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
        profile_complete: isProfileComplete(
          first_name,
          last_name,
          email,
          birth_date,
          phone_number,
          bank_details,
          identification_order
        ),
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

export const joinClinic = async (
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
        id: logged_in_id,
      },
    });

    if (!vetProfile) return res.status(404).json("Vet does not exist");

    const isVetPartOfClinic = await prisma.vetClinic.findUnique({
      where: {
        vet_id_clinic_id: {
          vet_id: logged_in_id,
          clinic_id: id,
        },
      },
    });

    if (isVetPartOfClinic)
      return res.status(400).json("Vet is already part of this clinic");

    const vetClinic = await prisma.vetClinic.create({
      data: {
        vet_id: logged_in_id,
        clinic_id: id,
      },
    });
  } catch (e) {
    res.status(500).json(e);
  }
};

const isProfileComplete = (
  first_name: string,
  last_name: string,
  email: string,
  birth_date: string,
  phone_number: string,
  bank_details: string,
  identification_order: string
) => {
  return (
    first_name != undefined &&
    last_name != undefined &&
    email != undefined &&
    birth_date != undefined &&
    phone_number != undefined &&
    bank_details != undefined &&
    identification_order != undefined &&
    first_name != "" &&
    last_name != "" &&
    email != "" &&
    birth_date != "" &&
    phone_number != "" &&
    bank_details != "" &&
    identification_order != "" &&
    identification_order != "1111111111"
  );
};
