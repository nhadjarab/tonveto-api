import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleTokenVerification } from "../authentication/authentication";

export const addAppointment = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { date, time, pet_id, vet_id, user_id } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != user_id) return res.status(401).json("Unauthorized");

    const doesUserExist = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!doesUserExist)
      return res.status(404).json(`User with id:${user_id} does not exist`);

    const doesPetExist = await prisma.pet.findUnique({
      where: {
        id: pet_id,
      },
    });

    if (!doesPetExist)
      return res.status(404).json(`Pet with id:${pet_id} does not exist`);

    const doesVetExist = await prisma.vet.findUnique({
      where: {
        id: vet_id,
      },
    });

    if (!doesVetExist)
      return res.status(404).json(`Vet with id:${vet_id} does not exist`);

    const newAppointment = await prisma.appointment.create({
      data: {
        date,
        time,
        pet_id,
        vet_id,
        user_id,
      },
    });

    res.status(200).json(newAppointment);
  } catch (e) {
    console.log(e);
  }
};

export const updateAppointment = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    const { date, time, pet_id, vet_id, user_id } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != user_id) return res.status(401).json("Unauthorized");

    const doesUserExist = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!doesUserExist)
      return res.status(404).json(`User with id:${user_id} does not exist`);

    const doesPetExist = await prisma.pet.findUnique({
      where: {
        id: pet_id,
      },
    });

    if (!doesPetExist)
      return res.status(404).json(`Pet with id:${pet_id} does not exist`);

    const doesVetExist = await prisma.vet.findUnique({
      where: {
        id: vet_id,
      },
    });

    if (!doesVetExist)
      return res.status(404).json(`Vet with id:${vet_id} does not exist`);

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id,
      },
      data: {
        date,
        time,
        pet_id,
        vet_id,
        user_id,
      },
    });

    res.status(200).json(updatedAppointment);
  } catch (e) {
    console.log(e);
  }
};

export const getAppointment = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != user_id) return res.status(401).json("Unauthorized");

    const appointment = await prisma.appointment.findUnique({
      where: {
        id,
      },
      include: {
        pet: true,
        vet: true,
        user: true,
      },
    });

    if (!appointment) return res.status(404).json("Appointment not found");

    res.status(200).json(appointment);
  } catch (e) {
    console.log(e);
  }
};

export const cancelAppointments = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != user_id) return res.status(401).json("Unauthorized");

    const appointment = await prisma.appointment.delete({
      where: {
        id,
      },
    });

    if (!appointment) return res.status(404).json("Appointment not found");

    res.status(200).json("Appointment canceled successfully");
  } catch (e) {
    console.log(e);
  }
};
