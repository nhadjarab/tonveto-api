import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import { handleTokenVerification } from "../authentication/authentication";

export const search = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { query } = req.params;

    const clinics = await prisma.clinic.findMany({});

    const vets = await prisma.vet.findMany({
      include: {
        specialities: true,
      },
    });

    // Filter clinics and vets by query
    const filteredClinics = clinics.filter(
      (clinic) =>
        clinic.name.toLowerCase().includes(query.toLowerCase()) ||
        clinic.city.toLowerCase().includes(query.toLowerCase()) ||
        clinic.address.toLowerCase().includes(query.toLowerCase()) ||
        clinic.country.toLowerCase().includes(query.toLowerCase())
    );

    const filteredVets = vets.filter(
      (vet) =>
        vet.first_name.toLowerCase().includes(query.toLowerCase()) ||
        vet.last_name.toLowerCase().includes(query.toLowerCase()) ||
        (vet.first_name + " " + vet.last_name)
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        vet.specialities.some((speciality) =>
          speciality.name.toLowerCase().includes(query.toLowerCase())
        )
    );

    return res.status(200).json({ filteredClinics, filteredVets });
  } catch (e) {
    res.status(500).json(e);
  }
};
