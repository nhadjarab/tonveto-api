import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleTokenVerification } from "../authentication/authentication";

export const addPet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const {
      sex,
      name,
      birth_date,
      species,
      breed,
      crossbreed,
      sterilised,
      owner_id,
    } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != owner_id) return res.status(401).json("Unauthorized");

    const doesUserExist = await prisma.user.findUnique({
      where: {
        id: owner_id,
      },
    });

    if (!doesUserExist) return res.status(404).json("Pet owner does not exist");

    const newPet = await prisma.pet.create({
      data: {
        sex,
        name,
        birth_date,
        species,
        breed,
        crossbreed,
        sterilised,
        owner_id,
      },
    });

    res.status(200).json(newPet);
  } catch (e) {
    console.log(e);
  }
};

export const updatePet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    const {
      sex,
      name,
      birth_date,
      species,
      breed,
      crossbreed,
      sterilised,
      owner_id,
    } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != owner_id) return res.status(401).json("Unauthorized");

    const newPet = await prisma.pet.update({
      where: {
        id,
      },
      data: {
        sex,
        name,
        birth_date,
        species,
        breed,
        crossbreed,
        sterilised,
        owner_id,
      },
    });

    if (!newPet) res.status(404).json("Pet not found");

    res.status(200).json(newPet);
  } catch (e) {
    console.log(e);
  }
};

export const getPet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;
    const { owner_id } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != owner_id) return res.status(401).json("Unauthorized");

    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    });

    if (!pet) return res.status(404).json("Pet not found");

    res.status(200).json(pet);
  } catch (e) {
    console.log(e);
  }
};

export const deletePet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;
    const { owner_id } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != owner_id) return res.status(401).json("Unauthorized");

    const pet = await prisma.pet.delete({
      where: {
        id,
      },
    });

    if (!pet) return res.status(404).json("Pet not found");

    res.status(200).json("Pet deleted successfully");
  } catch (e) {
    console.log(e);
  }
};
