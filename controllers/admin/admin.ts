import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleTokenVerification } from "../authentication/authentication";

export const getAllUsers = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { logged_in_id } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const admin = await prisma.admin.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!admin) return res.status(404).json("Admin not found");

    const users = await prisma.user.findMany({
      include: {
        appointments: true,
        pets: {
          include: {
            appointments: true,
            MedicalReport: true,
          },
        },
      },
    });

    res.status(200).json(users);
  } catch (e) {
    console.log(e);
  }
};

export const getAllVets = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { logged_in_id } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const admin = await prisma.admin.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!admin) return res.status(404).json("Admin not found");

    const vets = await prisma.vet.findMany({
      include: {
        calendar: true,
        appointments: true,
        clinics: {
          include: {
            clinic: true,
          },
        },
        MedicalReport: true,
        specialities: true,
      },
    });

    res.status(200).json(vets);
  } catch (e) {
    console.log(e);
  }
};

export const getAllClinics = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { logged_in_id } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const admin = await prisma.admin.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!admin) return res.status(404).json("Admin not found");

    const clinics = await prisma.clinic.findMany({
      include: {
        vets: {
          include: {
            vet: true,
          },
        },
      },
    });

    res.status(200).json(clinics);
  } catch (e) {
    console.log(e);
  }
};

export const getAllAppointments = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { logged_in_id } = req.body;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const admin = await prisma.admin.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!admin) return res.status(404).json("Admin not found");

    const appointments = await prisma.appointment.findMany({
      include: {
        vet: true,
        pet: true,
        MedicalReport: true,
        user: true,
      },
    });

    res.status(200).json(appointments);
  } catch (e) {
    console.log(e);
  }
};

export const approveClinic = async (
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

    const admin = await prisma.admin.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!admin) return res.status(404).json("Admin not found");

    const clinic = await prisma.clinic.findUnique({
      where: {
        id,
      },
    });

    if (!clinic) return res.status(404).json("Clinic not found");

    const updatedClinic = await prisma.clinic.update({
      where: {
        id,
      },
      data: {
        is_approved: true,
      },
    });

    res.status(200).json(updatedClinic);
  } catch (e) {
    console.log(e);
  }
};

export const approveVet = async (
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

    const admin = await prisma.admin.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!admin) return res.status(404).json("Admin not found");

    const vet = await prisma.vet.findUnique({
      where: {
        id,
      },
    });

    if (!vet) return res.status(404).json("Clinic not found");

    const updatedVet = await prisma.vet.update({
      where: {
        id,
      },
      data: {
        is_approved: true,
      },
    });

    res.status(200).json(updatedVet);
  } catch (e) {
    console.log(e);
  }
};
