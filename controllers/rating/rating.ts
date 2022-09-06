import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleTokenVerification } from "../authentication/authentication";

export const addRatingVet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { logged_in_id } = req.headers;

    const { rating, vet_id } = req.body;

    if (!rating || !vet_id) return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    if (parseFloat(rating) > 5 || parseFloat(rating) < 0)
      return res.status(400).json("Rating must be between 0 and 5");

    const user = await prisma.user.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!user) return res.status(404).json("User not found");

    const vet = await prisma.vet.findUnique({
      where: {
        id: vet_id,
      },
    });

    if (!vet) return res.status(404).json("Vet not found");

    const ratingData = await prisma.ratingVet.create({
      data: {
        rating: parseFloat(rating),
        vet_id,
        owner_id: logged_in_id,
      },
    });

    res.status(200).json(ratingData);
  } catch (e) {
    console.log(e);
  }
};

export const editRatingVet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json("Missing id");

    const { logged_in_id } = req.headers;

    const { rating } = req.body;

    if (!rating) return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");
    if (parseFloat(rating) > 5 || parseFloat(rating) < 0)
      return res.status(400).json("Rating must be between 0 and 5");

    const user = await prisma.user.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!user) return res.status(404).json("User not found");

    const doesRatingExist = await prisma.ratingVet.findUnique({
      where: {
        id: id,
      },
    });

    if (!doesRatingExist) return res.status(404).json("Rating not found");

    if (doesRatingExist.owner_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const newRating = await prisma.ratingVet.update({
      where: {
        id,
      },
      data: {
        rating: parseFloat(rating),
      },
    });

    res.status(200).json(newRating);
  } catch (e) {
    console.log(e);
  }
};

export const deleteRatingVet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json("Missing id");

    const { logged_in_id } = req.headers;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const doesRatingExist = await prisma.ratingVet.findUnique({
      where: {
        id: id,
      },
    });

    if (!doesRatingExist) return res.status(404).json("Rating not found");
    if (doesRatingExist.owner_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const oldRating = await prisma.ratingVet.delete({
      where: {
        id,
      },
    });

    res.status(200).json(oldRating);
  } catch (e) {
    console.log(e);
  }
};

export const addRatingClinic = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { logged_in_id } = req.headers;

    const { rating, clinic_id } = req.body;

    if (!rating || !clinic_id) return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    if (parseFloat(rating) > 5 || parseFloat(rating) < 0)
      return res.status(400).json("Rating must be between 0 and 5");

    const user = await prisma.user.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!user) return res.status(404).json("User not found");

    const vet = await prisma.clinic.findUnique({
      where: {
        id: clinic_id,
      },
    });

    if (!vet) return res.status(404).json("Vet not found");

    const ratingData = await prisma.ratingClinic.create({
      data: {
        rating: parseFloat(rating),
        clinic_id,
        owner_id: logged_in_id,
      },
    });

    res.status(200).json(ratingData);
  } catch (e) {
    console.log(e);
  }
};

export const editRatingClinic = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json("Missing id");

    const { logged_in_id } = req.headers;

    const { rating } = req.body;

    if (!rating) return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");
    if (parseFloat(rating) > 5 || parseFloat(rating) < 0)
      return res.status(400).json("Rating must be between 0 and 5");

    const user = await prisma.user.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!user) return res.status(404).json("User not found");

    const doesRatingExist = await prisma.ratingClinic.findUnique({
      where: {
        id: id,
      },
    });

    if (!doesRatingExist) return res.status(404).json("Rating not found");

    if (doesRatingExist.owner_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const newRating = await prisma.ratingClinic.update({
      where: {
        id,
      },
      data: {
        rating: parseFloat(rating),
      },
    });

    res.status(200).json(newRating);
  } catch (e) {
    console.log(e);
  }
};

export const deleteRatingClinic = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json("Missing id");

    const { logged_in_id } = req.headers;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const doesRatingExist = await prisma.ratingClinic.findUnique({
      where: {
        id: id,
      },
    });

    if (!doesRatingExist) return res.status(404).json("Rating not found");
    if (doesRatingExist.owner_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const oldRating = await prisma.ratingClinic.delete({
      where: {
        id,
      },
    });

    res.status(200).json(oldRating);
  } catch (e) {
    console.log(e);
  }
};
