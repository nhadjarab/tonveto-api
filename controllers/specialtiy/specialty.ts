import { PrismaClient } from "@prisma/client";
import { ifError } from "assert";
import { Request, Response } from "express";
import { handleTokenVerification } from "../authentication/authentication";

export const addSpecialty = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { name, price, owner_id } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != owner_id) return res.status(401).json("Unauthorized");

    const doesUserExist = await prisma.vet.findUnique({
      where: {
        id: owner_id,
      },
    });

    if (!doesUserExist) return res.status(404).json("Vet does not exist");

    const newSpecialty = await prisma.specialty.create({
      data: {
        name,
        price,
        vet_id: owner_id,
      },
    });

    res.status(200).json(newSpecialty);
  } catch (e) {
    console.log(e);
  }
};

export const updateSpecialty = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    const { name, price, owner_id } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != owner_id) return res.status(401).json("Unauthorized");

    const specialty = await prisma.specialty.findUnique({
      where: {
        id,
      },
    });

    if (!specialty) return res.status(404).json("Specialty does not exist");

    const newSpecialty = await prisma.specialty.update({
      where: {
        id,
      },
      data: {
        name,
        price,
      },
    });

    res.status(200).json(newSpecialty);
  } catch (e) {
    console.log(e);
  }
};

export const getSpecialty = async (
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

    const specialty = await prisma.specialty.findUnique({
      where: {
        id,
      },
      include: {
        vet: true,
      },
    });

    if (!specialty) return res.status(404).json("Specialty not found");

    res.status(200).json(specialty);
  } catch (e) {
    console.log(e);
  }
};

export const deleteSpecialty = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;
    const { owner_id } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != owner_id) return res.status(401).json("Unauthorized");

    const specialty = await prisma.specialty.findUnique({
      where: {
        id,
      },
    });

    if (!specialty) return res.status(404).json("Specialty not found");

    if (specialty.vet_id != owner_id)
      return res.status(401).json("Unauthorized");

    const removedSpecialty = await prisma.specialty.delete({
      where: {
        id,
      },
    });

    res.status(200).json("Specialty deleted successfully");
  } catch (e) {
    console.log(e);
  }
};
