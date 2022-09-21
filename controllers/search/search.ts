import { Clinic, PrismaClient, Specialty, Vet } from "@prisma/client";
import { Request, Response } from "express";

import { handleTokenVerification } from "../authentication/authentication";

export const search = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { query } = req.params;

    if (!query) return res.status(400).json("Missing fields");

    const clinics = await prisma.clinic.findMany({
      where: {
        is_approved: true,
      },

    });

    const vets = await prisma.vet.findMany({
      include: {
        specialities: true,
      },
      where: {
        is_approved: true,
      },
    });

    let vetsWithRatings: any = [];

    for await (const vet of vets) {
      const vetRating = await prisma.ratingVet.aggregate({
        where: {
          vet_id: vet.id,
        },
        _avg: {
          rating: true,
        },
      });

      vetsWithRatings.push({ ...vet, vetRating });
    }

    let clinicsWithRatings: any = [];

  
    for await (const clinic of clinics) {
      const clinicRating = await prisma.ratingClinic.aggregate({
        where: {
          clinic_id: clinic.id,
        },
        _avg: {
          rating: true,
        },
      });

      clinicsWithRatings.push({ ...clinic, clinicRating });
    }

    // Filter clinics and vets by query
    const filteredClinics = clinicsWithRatings.filter(
      (clinic: Clinic) =>
        clinic.name.toLowerCase().includes(query.toLowerCase()) ||
        clinic.city.toLowerCase().includes(query.toLowerCase()) ||
        clinic.address.toLowerCase().includes(query.toLowerCase()) ||
        clinic.country.toLowerCase().includes(query.toLowerCase())
    );

    const filteredVets = vetsWithRatings.filter(
      (
        vet: Vet & {
          specialities: Specialty[];
        }
      ) =>
        vet.first_name.toLowerCase().includes(query.toLowerCase()) ||
        vet.last_name.toLowerCase().includes(query.toLowerCase()) ||
        (vet.first_name + " " + vet.last_name)
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        vet.specialities!.some((speciality) =>
          speciality.name.toLowerCase().includes(query.toLowerCase())
        )
    );

    return res.status(200).json({ filteredClinics, filteredVets });
  } catch (e) {
    res.status(500).json(e);
  }
};

export const advancedSearch = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const {
      city,
      zip_code,
      clinic_name,
      vet_name,
      specialty,
      address,
      country,
    } = req.query;

    const clinics = await prisma.clinic.findMany({
      where: {
        is_approved: true,
      },
  
    });

    const vets = await prisma.vet.findMany({
      include: {
        specialities: true,
      },
      where: {
        is_approved: true,
      },
    });

    let vetsWithRatings: any = [];

    for await (const vet of vets) {
      const vetRating = await prisma.ratingVet.aggregate({
        where: {
          vet_id: vet.id,
        },
        _avg: {
          rating: true,
        },
      });

      vetsWithRatings.push({ ...vet, vetRating });
    }

    let clinicsWithRatings: any = [];

  
    for await (const clinic of clinics) {
      const clinicRating = await prisma.ratingClinic.aggregate({
        where: {
          clinic_id: clinic.id,
        },
        _avg: {
          rating: true,
        },
      });

      clinicsWithRatings.push({ ...clinic, clinicRating });
    }

    // check if queries are undefined
    if (
      city == undefined &&
      zip_code == undefined &&
      clinic_name == undefined &&
      vet_name == undefined &&
      specialty == undefined &&
      address == undefined &&
      country == undefined
    )
      return res.status(200).json({
        filteredClinics: clinicsWithRatings,
        filteredVets: vetsWithRatings,
      });

    // Filter clinics and vets by query
    const filteredClinics = clinics.filter(
      (clinic) =>
        clinic.name
          .toLowerCase()
          .includes((clinic_name as string)?.toLowerCase()) ||
        clinic.city.toLowerCase().includes((city as string)?.toLowerCase()) ||
        clinic.address
          .toLowerCase()
          .includes((address as string)?.toLowerCase()) ||
        clinic.zip_code
          .toLowerCase()
          .includes((zip_code as string)?.toLowerCase()) ||
        clinic.country
          .toLowerCase()
          .includes((country as string)?.toLowerCase())
    );

    const filteredVets = vets.filter(
      (vet) =>
        vet.first_name
          .toLowerCase()
          .includes((vet_name as string)?.toLowerCase()) ||
        vet.last_name
          .toLowerCase()
          .includes((vet_name as string)?.toLowerCase()) ||
        (vet.first_name + " " + vet.last_name)
          .toLowerCase()
          .includes((vet_name as string)?.toLowerCase()) ||
        vet.specialities.some((speciality) =>
          speciality.name
            .toLowerCase()
            .includes((specialty as string)?.toLowerCase())
        )
    );

    return res.status(200).json({ filteredClinics, filteredVets });
  } catch (e) {
    res.status(500).json(e);
  }
};
