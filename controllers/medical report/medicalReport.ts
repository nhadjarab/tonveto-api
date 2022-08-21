import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleTokenVerification } from "../authentication/authentication";

export const addMedicalReport = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const {
      appointment_id,
      reason,
      diagnosis,
      treatment,
      notes,
      pet_id,
      vet_id,
    } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != vet_id) return res.status(401).json("Unauthorized");

    const doesVetExist = await prisma.vet.findUnique({
      where: {
        id: vet_id,
      },
    });

    if (!doesVetExist) return res.status(404).json("Vet does not exist");

    if (!doesVetExist.is_approved)
      return res.status(400).json("Vet is not approved yet");

    const doesPetExist = await prisma.pet.findUnique({
      where: {
        id: pet_id,
      },
    });

    if (!doesPetExist) return res.status(404).json("Pet does not exist");

    const doesAppointmentExist = await prisma.appointment.findUnique({
      where: {
        id: appointment_id,
      },
    });

    if (!doesAppointmentExist)
      return res.status(404).json("Appointment does not exist");

    const medicalReport = await prisma.medicalReport.create({
      data: {
        appointment_id,
        reason,
        diagnosis,
        treatment,
        notes,
        pet_id,
        vet_id,
      },
    });

    res.status(200).json(medicalReport);
  } catch (e) {
    console.log(e);
  }
};

export const updateMedicalReport = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    const {
      appointment_id,
      reason,
      diagnosis,
      treatment,
      notes,
      pet_id,
      logged_in_id,
    } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const doesMedicalReportExist = await prisma.medicalReport.findUnique({
      where: {
        id,
      },
    });

    if (!doesMedicalReportExist)
      return res.status(404).json("Medical report does not exist");

    if (doesMedicalReportExist.vet_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const medicalReport = await prisma.medicalReport.update({
      where: {
        id,
      },
      data: {
        appointment_id,
        reason,
        diagnosis,
        treatment,
        notes,
        pet_id,
      },
    });

    res.status(200).json(medicalReport);
  } catch (e) {
    console.log(e);
  }
};

export const getMedicalReport = async (
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

    const medicalReport = await prisma.medicalReport.findUnique({
      where: {
        id,
      },
      include: {
        pet: true,
        vet: true,
        appointment: true,
      },
    });

    if (!medicalReport) return res.status(404).json("Medical Report not found");

    res.status(200).json(medicalReport);
  } catch (e) {
    console.log(e);
  }
};
