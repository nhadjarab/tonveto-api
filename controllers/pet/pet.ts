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
