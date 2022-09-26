import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleTokenVerification } from "../authentication/authentication";

export const getAllUsers = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { logged_in_id } = req.headers;

    if (!logged_in_id) return res.status(400).json("Missing logged in id");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId !== logged_in_id)
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
    const { logged_in_id } = req.headers;

    if (!logged_in_id) return res.status(400).json("Missing logged in id");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId !== logged_in_id)
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
        CommentVet: {
          include: {
            rating: true,
          },
        },
      },
    });

    res.status(200).json(vets);
  } catch (e) {
    console.log(e);
  }
};

export const updateAdmin = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json("Missing fields");

    const { email, birth_date, first_name, last_name, phone_number } = req.body;

    if (
      email == undefined ||
      birth_date == undefined ||
      first_name == undefined ||
      last_name == undefined ||
      phone_number == undefined
    )
      return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != id) return res.status(401).json("Unauthorized");

    const oldAdmin = await prisma.admin.findUnique({
      where: {
        id,
      },
    });

    if (!oldAdmin) return res.status(404).json("Admin does not exist");

    if (oldAdmin.email != email) {
      const doesAuthExist = await prisma.auth.findUnique({
        where: {
          email,
        },
      });

      if (doesAuthExist)
        return res.status(400).json("Email already being used");

      const newAuth = await prisma.auth.update({
        where: {
          email: oldAdmin.email,
        },
        data: {
          email,
        },
      });
    }

    const adminProfile = await prisma.admin.update({
      where: {
        id,
      },
      data: {
        first_name,
        last_name,
        email,
        birth_date,
        phone_number,
      },
    });

    res.status(200).json(adminProfile);
  } catch (e) {
    res.status(500).json(e);
  }
};

export const getAllClinics = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { logged_in_id } = req.headers;

    if (!logged_in_id) return res.status(400).json("Missing logged in id");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId !== logged_in_id)
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
    const { logged_in_id } = req.headers;

    if (!logged_in_id) return res.status(400).json("Missing logged in id");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId !== logged_in_id)
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
export const getAllPayments = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { logged_in_id } = req.headers;

    if (!logged_in_id) return res.status(400).json("Missing logged in id");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId !== logged_in_id)
      return res.status(401).json("Unauthorized");

    const admin = await prisma.admin.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!admin) return res.status(404).json("Admin not found");

    const appointments = await prisma.pendingPayment.findMany({
      include: {
        vet: true,
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

    if (!id || id === "") {
      return res.status(400).json("Missing id");
    }

    const { logged_in_id } = req.headers;

    if (!logged_in_id) return res.status(400).json("Missing logged in id");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId !== logged_in_id)
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

    if (!id || id === "") {
      return res.status(400).json("Missing id");
    }

    const { logged_in_id } = req.headers;

    if (!logged_in_id) return res.status(400).json("Missing logged in id");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId !== logged_in_id)
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

export const getCommentReports = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { logged_in_id } = req.headers;

    if (!logged_in_id) return res.status(400).json("Missing logged in id");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId !== logged_in_id)
      return res.status(401).json("Unauthorized");

    const admin = await prisma.admin.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!admin) return res.status(404).json("Admin not found");

    const vetCommentReports = await prisma.commentVetReport.findMany({
      include: {
        comment: {
          include: {
            rating: true,
          },
        },
      },
    });

    const clinicCommentReports = await prisma.commentClinicReport.findMany({
      include: {
        comment: {
          include: {
            rating: true,
          },
        },
      },
    });

    const totalReports = [...vetCommentReports, ...clinicCommentReports];

    res.status(200).json(totalReports);
  } catch (e) {
    console.log(e);
  }
};

export const approveCommentReport = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") {
      return res.status(400).json("Missing id");
    }

    const { logged_in_id, comment_type, comment_id } = req.headers;

    console.log(req.headers);

    if (!logged_in_id) return res.status(400).json("Missing logged in id");

    if (comment_type == undefined || comment_id == undefined)
      return res.status(400).json("Missing comment fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId !== logged_in_id)
      return res.status(401).json("Unauthorized");

    const admin = await prisma.admin.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    let commentReport;

    if (comment_type === "vet") {
      const comment = await prisma.commentVet.findUnique({
        where: {
          id: comment_id as string,
        },
      });

      if (!comment) return res.status(404).json("Comment not found");
      commentReport = await prisma.commentVetReport.delete({
        where: {
          id,
        },
      });

      await prisma.ratingVet.delete({
        where: {
          id: comment.rating_id,
        },
      });
    } else if (comment_type === "clinic") {
      const comment = await prisma.commentClinic.findUnique({
        where: {
          id: comment_id as string,
        },
      });

      if (!comment) return res.status(404).json("Comment not found");
      commentReport = await prisma.commentClinicReport.delete({
        where: {
          id,
        },
      });

      await prisma.ratingClinic.delete({
        where: {
          id: comment.rating_id,
        },
      });
    } else {
      return res.status(400).json("Invalid comment type");
    }

    res.status(200).json(commentReport);
  } catch (e) {
    console.log(e);
  }
};
export const rejectCommentReport = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") {
      return res.status(400).json("Missing id");
    }

    const { logged_in_id, comment_type, comment_id } = req.headers;

    if (!logged_in_id) return res.status(400).json("Missing logged in id");

    if (comment_type == undefined || comment_id == undefined)
      return res.status(400).json("Missing comment fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId !== logged_in_id)
      return res.status(401).json("Unauthorized");

    const admin = await prisma.admin.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    let commentReport;

    if (comment_type === "vet") {
      const comment = await prisma.commentVet.findUnique({
        where: {
          id: comment_id as string,
        },
      });

      if (!comment) return res.status(404).json("Comment not found");

      commentReport = await prisma.commentVetReport.delete({
        where: {
          id,
        },
      });
    } else if (comment_type === "clinic") {
      const comment = await prisma.commentClinic.findUnique({
        where: {
          id: comment_id as string,
        },
      });

      if (!comment) return res.status(404).json("Comment not found");

      commentReport = await prisma.commentClinicReport.delete({
        where: {
          id,
        },
      });
    } else {
      return res.status(400).json("Invalid comment type");
    }

    res.status(200).json(commentReport);
  } catch (e) {
    console.log(e);
  }
};

export const getAllVetApplications = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { logged_in_id } = req.headers;

    if (!logged_in_id) return res.status(400).json("Missing logged in id");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId !== logged_in_id)
      return res.status(401).json("Unauthorized");

    const admin = await prisma.admin.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!admin) return res.status(404).json("Admin not found");

    const vets = await prisma.vet.findMany({
      where: {
        is_approved: false,
      },
    });

    res.status(200).json(vets);
  } catch (e) {
    console.log(e);
  }
};

export const getAllClinicApplications = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { logged_in_id } = req.headers;

    if (!logged_in_id) return res.status(400).json("Missing logged in id");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId !== logged_in_id)
      return res.status(401).json("Unauthorized");

    const admin = await prisma.admin.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!admin) return res.status(404).json("Admin not found");

    const clinics = await prisma.clinic.findMany({
      include: {
        owner: true,
      },
      where: {
        is_approved: false,
      },
    });

    res.status(200).json(clinics);
  } catch (e) {
    console.log(e);
  }
};
