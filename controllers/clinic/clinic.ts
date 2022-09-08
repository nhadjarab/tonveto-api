import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleTokenVerification } from "../authentication/authentication";

export const createClinic = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { name, address, city, country, phone_number, owner_id } = req.body;

    if (
      name == undefined ||
      address == undefined ||
      city == undefined ||
      country == undefined ||
      phone_number == undefined ||
      owner_id == undefined
    ) {
      return res.status(400).json("Missing fields");
    }

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != owner_id) return res.status(401).json("Unauthorized");

    const isUserVet = await prisma.vet.findUnique({
      where: {
        id: owner_id,
      },
    });

    if (!isUserVet) return res.status(404).json("Vet does not exist");
    if (isUserVet.type != "vet") return res.status(401).json("Unauthorized");
    

    const newClinic = await prisma.clinic.create({
      data: {
        name,
        address,
        city,
        country,
        phone_number,
        owner_id,
      },
    });

    const clinicVet = await prisma.vetClinic.create({
      data: {
        clinic_id: newClinic.id,
        vet_id: owner_id,
        approved: true,
      },
    });

    res.status(200).json(newClinic);
  } catch (e) {
    console.log(e);
  }
};

export const updateClinic = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") return res.status(400).json("Missing fields");

     const { logged_in_id } = req.headers;

    if(!logged_in_id) return res.status(400).json("Missing logged in id")

    const { name, address, city, country, phone_number, owner_id } = req.body;

    if (
      name == undefined ||
      address == undefined ||
      city == undefined ||
      country == undefined ||
      phone_number == undefined ||
      owner_id == undefined
    ) {
      return res.status(400).json("Missing fields");
    }

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const isUserVet = await prisma.vet.findUnique({
      where: {
        id: owner_id,
      },
    });

    if (!isUserVet) return res.status(404).json("Vet does not exist");
    if (isUserVet.type != "vet") return res.status(401).json("Unauthorized");
    if (!isUserVet.is_approved)
      return res.status(400).json("Vet is not approved yet");

    const clinic = await prisma.clinic.findUnique({
      where: {
        id,
      },
    });

    if (!clinic) return res.status(404).json("Clinic does not exist");

    if (clinic.owner_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const newClinic = await prisma.clinic.update({
      where: {
        id,
      },
      data: {
        name,
        address,
        city,
        country,
        phone_number,
        owner_id,
      },
    });

    res.status(200).json(newClinic);
  } catch (e) {
    console.log(e);
  }
};

export const getClinic = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") return res.status(400).json("Missing fields");

     const { logged_in_id } = req.headers;

    if(!logged_in_id) return res.status(400).json("Missing logged in id")

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const clinic = await prisma.clinic.findUnique({
      where: {
        id,
      },
      include: {
        CommentClinic: true,
        vets: {
          include: {
            vet: true,
          },
          where: {
            approved: true,
          },
        },
        owner: true,
      },
    });

    if (!clinic) return res.status(404).json("Clinic does not exist");

    const clinicRating = await prisma.ratingClinic.aggregate({
      where: {
        clinic_id: id,
      },
      _avg: {
        rating: true,
      },
    });

    res.status(200).json({ clinic, clinicRating });
  } catch (e) {
    console.log(e);
  }
};

export const deleteClinic = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") return res.status(400).json("Missing fields");

     const { logged_in_id } = req.headers;

    if(!logged_in_id) return res.status(400).json("Missing logged in id")

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const clinic = await prisma.clinic.findUnique({
      where: {
        id,
      },
    });

    if (!clinic) return res.status(404).json("Clinic does not exist");

    if (clinic.owner_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const deleteRelation = await prisma.vetClinic.deleteMany({
      where: {
        clinic_id: id,
      },
    });

    const deleteComments = await prisma.commentClinic.deleteMany({
      where: {
        clinic_id: id,
      },
    });

    const deleteReport = await prisma.commentClinicReport.deleteMany({
      where: {
        clinic_id: id,
      },
    });

    const deleteRatings = await prisma.ratingClinic.deleteMany({
      where: {
        clinic_id: id,
      },
    });

    const deletedClinic = await prisma.clinic.delete({
      where: { id },
    });

    res.status(200).json(deletedClinic);
  } catch (e) {
    console.log(e);
  }
};

export const addVetToClinic = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { vet_id, clinic_id } = req.body;

     const { logged_in_id } = req.headers;

    if(!logged_in_id) return res.status(400).json("Missing logged in id")

    if (vet_id == undefined || clinic_id == undefined)
      return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const clinic = await prisma.clinic.findUnique({
      where: {
        id: clinic_id,
      },
    });

    if (!clinic) return res.status(404).json("Clinic does not exist");
    if (!clinic.is_approved)
      return res.status(400).json("Clinic is not approved yet");
    if (clinic.owner_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const vet = await prisma.vet.findUnique({
      where: {
        id: vet_id,
      },
    });

    if (!vet) return res.status(404).json("Vet does not exist");
    if (!vet.is_approved)
      return res.status(400).json("Vet is not approved yet");

    const isVetAMember = await prisma.vetClinic.findUnique({
      where: {
        vet_id_clinic_id: {
          vet_id: vet_id,
          clinic_id,
        },
      },
    });

    if (isVetAMember)
      return res.status(400).json("Vet is already a member of this clinic");

    const vetClinic = await prisma.vetClinic.create({
      data: {
        vet_id,
        clinic_id,
      },
    });

    res.status(200).json(`Vet added to clinic : ${clinic.name}`);
  } catch (e) {
    console.log(e);
  }
};

export const removeVetFromClinic = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") return res.status(400).json("Missing fields");

     const { logged_in_id } = req.headers;

    if(!logged_in_id) return res.status(400).json("Missing logged in id")

    const { clinic_id } = req.body;

    if (clinic_id == undefined) return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const clinic = await prisma.clinic.findUnique({
      where: {
        id: clinic_id,
      },
      include: {
        vets: {
          include: {
            vet: true,
          },
          where: {
            approved: true,
          },
        },
        owner: true,
      },
    });

    if (!clinic) return res.status(404).json("Clinic does not exist");

    if (clinic.owner_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const vet = await prisma.vet.findUnique({
      where: {
        id,
      },
    });

    if (!vet) return res.status(404).json("Vet does not exist");

    const vetClinic = await prisma.vetClinic.delete({
      where: {
        vet_id_clinic_id: {
          clinic_id,
          vet_id: id,
        },
      },
    });

    res.status(200).json(`Vet removed from clinic : ${clinic.name}`);
  } catch (e) {
    console.log(e);
  }
};

export const approveNewVet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") return res.status(400).json("Missing fields");

     const { logged_in_id } = req.headers;

    if(!logged_in_id) return res.status(400).json("Missing logged in id")

    const { clinic_id } = req.body;

    if (clinic_id == undefined) return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const clinic = await prisma.clinic.findUnique({
      where: {
        id: clinic_id,
      },
      include: {
        vets: {
          include: {
            vet: true,
          },
          where: {
            // approved: true,
          },
        },
        owner: true,
      },
    });

    if (!clinic) return res.status(404).json("Clinic does not exist");

    const vet = await prisma.vet.findUnique({
      where: {
        id,
      },
    });

    if (!vet) return res.status(404).json("Vet does not exist");

    const vetClinicRelation = await prisma.vetClinic.findUnique({
      where: {
        vet_id_clinic_id: {
          vet_id: id,
          clinic_id,
        },
      },
    });

    if (!vetClinicRelation)
      return res.status(404).json("Vet is not a member of this clinic");

    if (clinic.owner_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const vetClinic = await prisma.vetClinic.update({
      where: {
        vet_id_clinic_id: {
          vet_id: id,
          clinic_id,
        },
      },
      data: {
        approved: true,
      },
    });

    res.status(200).json(`Vet approved into clinic : ${clinic.name}`);
  } catch (e) {
    console.log(e);
  }
};

export const rejectNewVet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") return res.status(400).json("Missing fields");

     const { logged_in_id } = req.headers;

    if(!logged_in_id) return res.status(400).json("Missing logged in id")

    const { clinic_id } = req.body;

    if (clinic_id == undefined) return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const clinic = await prisma.clinic.findUnique({
      where: {
        id: clinic_id,
      },
      include: {
        vets: {
          include: {
            vet: true,
          },
          where: {
            // approved: true,
          },
        },
        owner: true,
      },
    });

    if (!clinic) return res.status(404).json("Clinic does not exist");

    const vet = await prisma.vet.findUnique({
      where: {
        id,
      },
    });

    if (!vet) return res.status(404).json("Vet does not exist");

    const vetClinicRelation = await prisma.vetClinic.findUnique({
      where: {
        vet_id_clinic_id: {
          vet_id: id,
          clinic_id,
        },
      },
    });

    if (!vetClinicRelation)
      return res.status(404).json("Vet is not a member of this clinic");

    if (clinic.owner_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const vetClinic = await prisma.vetClinic.delete({
      where: {
        vet_id_clinic_id: {
          vet_id: id,
          clinic_id,
        },
      },
    });

    res.status(200).json(`Vet rejected from clinic : ${clinic.name}`);
  } catch (e) {
    console.log(e);
  }
};

export const getClinicApplicants = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") return res.status(400).json("Missing fields");

     const { logged_in_id } = req.headers;

    if(!logged_in_id) return res.status(400).json("Missing logged in id")

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const clinic = await prisma.clinic.findUnique({
      where: {
        id,
      },
    });

    if (!clinic) return res.status(404).json("Clinic does not exist");

    if (!clinic.is_approved)
      return res.status(400).json("Clinic is not approved yet");

    if (clinic.owner_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const clinicApplicants = await prisma.vetClinic.findMany({
      where: {
        clinic_id: id,
        approved: false,
      },
      include: {
        vet: true,
      },
    });

    res.status(200).json(clinicApplicants);
  } catch (e) {
    console.log(e);
  }
};
