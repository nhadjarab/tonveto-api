import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleTokenVerification } from "../authentication/authentication";

export const addCalendar = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      owner_id,
    } = req.body;

    if (
      monday == undefined ||
      tuesday == undefined ||
      wednesday == undefined ||
      thursday == undefined ||
      friday == undefined ||
      saturday == undefined ||
      sunday == undefined ||
      owner_id == undefined
    ) {
      return res.status(400).json("Missing fields");
    }

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != owner_id) return res.status(401).json("Unauthorized");

    const doesUserExist = await prisma.vet.findUnique({
      where: {
        id: owner_id,
      },
    });

    if (!doesUserExist) return res.status(404).json("Vet does not exist");

    if (!doesUserExist.is_approved)
      return res.status(400).json("Vet is not approved yet");

    const newCalendar = await prisma.calendar.create({
      data: {
        monday: JSON.stringify(monday),
        tuesday: JSON.stringify(tuesday),
        wednesday: JSON.stringify(wednesday),
        thursday: JSON.stringify(thursday),
        friday: JSON.stringify(friday),
        saturday: JSON.stringify(saturday),
        sunday: JSON.stringify(sunday),
        owner_id,
      },
    });

    res.status(200).json(newCalendar);
  } catch (e) {
    console.log(e);
  }
};

export const updateCalendar = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") {
      return res.status(400).json("Missing id");
    }

    const {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      owner_id,
    } = req.body;

    if (
      monday == undefined ||
      tuesday == undefined ||
      wednesday == undefined ||
      thursday == undefined ||
      friday == undefined ||
      saturday == undefined ||
      sunday == undefined ||
      owner_id == undefined
    ) {
      return res.status(400).json("Missing fields");
    }

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != owner_id) return res.status(401).json("Unauthorized");

    const doesUserExist = await prisma.vet.findUnique({
      where: {
        id: owner_id,
      },
    });

    if (!doesUserExist) return res.status(404).json("Vet does not exist");

    if (!doesUserExist.is_approved)
      return res.status(400).json("Vet is not approved yet");

    const calendar = await prisma.calendar.findUnique({
      where: {
        id,
      },
    });

    if (!calendar) return res.status(404).json("Calendar does not exist");

    if (calendar.owner_id != owner_id)
      return res
        .status(401)
        .json("No calendar with that id exists on this vet");

    const newCalendar = await prisma.calendar.update({
      where: {
        id,
      },
      data: {
        monday: JSON.stringify(monday),
        tuesday: JSON.stringify(tuesday),
        wednesday: JSON.stringify(wednesday),
        thursday: JSON.stringify(thursday),
        friday: JSON.stringify(friday),
        saturday: JSON.stringify(saturday),
        sunday: JSON.stringify(sunday),
        owner_id,
      },
    });

    res.status(200).json(newCalendar);
  } catch (e) {
    console.log(e);
  }
};

export const getCalendar = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") {
      return res.status(400).json("Missing id");
    }

     const { logged_in_id } = req.headers;

    if(!logged_in_id) return res.status(400).json("Missing logged in id")

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const calendar = await prisma.calendar.findFirst({
      where: { owner_id: id },
      include: {
        vet: true,
      },
    });

    if (!calendar) return res.status(404).json("Calendar not found");

    res.status(200).json(calendar);
  } catch (e) {
    console.log(e);
  }
};

export const deleteCalendar = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") {
      return res.status(400).json("Missing id");
    }

    const { owner_id } = req.headers;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != owner_id) return res.status(401).json("Unauthorized");

    const calendar = await prisma.calendar.findUnique({
      where: {
        id,
      },
    });

    if (!calendar) return res.status(404).json("Calendar not found");

    if (calendar.owner_id != owner_id)
      return res.status(401).json("Unauthorized");

    const removedCalendar = await prisma.calendar.delete({
      where: {
        id,
      },
    });

    res.status(200).json("Calendar deleted successfully");
  } catch (e) {
    console.log(e);
  }
};
