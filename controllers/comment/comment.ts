import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleTokenVerification } from "../authentication/authentication";

export const addCommentVet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { logged_in_id } = req.headers;

    const { text, vet_id } = req.body;

    if (!text || !vet_id) return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

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

    const comment = await prisma.commentVet.create({
      data: {
        text,
        vet_id,
        owner_id: logged_in_id,
      },
    });

    res.status(200).json(comment);
  } catch (e) {
    console.log(e);
  }
};

export const editCommentVet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    const { logged_in_id } = req.headers;

    if (!id || id === "") return res.status(400).json("Missing fields");

    const { text } = req.body;

    if (!text) return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const user = await prisma.user.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!user) return res.status(404).json("User not found");

    const doesCommentExist = await prisma.commentVet.findUnique({
      where: {
        id: id,
      },
    });

    if (!doesCommentExist) return res.status(404).json("Comment not found");

    if (doesCommentExist.owner_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const comment = await prisma.commentVet.update({
      where: {
        id,
      },
      data: {
        text,
      },
    });

    res.status(200).json(comment);
  } catch (e) {
    console.log(e);
  }
};

export const deleteCommentVet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") return res.status(400).json("Missing fields");

    const { logged_in_id } = req.headers;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const doesCommentExist = await prisma.commentVet.findUnique({
      where: {
        id: id,
      },
    });

    if (!doesCommentExist) return res.status(404).json("Comment not found");
    if (doesCommentExist.owner_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const comment = await prisma.commentVet.delete({
      where: {
        id,
      },
    });

    res.status(200).json(comment);
  } catch (e) {
    console.log(e);
  }
};

export const addCommentClinic = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { logged_in_id } = req.headers;

    const { text, clinic_id } = req.body;

    if (!text || !clinic_id) return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const user = await prisma.user.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!user) return res.status(404).json("User not found");

    const clinic = await prisma.clinic.findUnique({
      where: {
        id: clinic_id,
      },
    });

    if (!clinic) return res.status(404).json("Vet not found");

    const comment = await prisma.commentClinic.create({
      data: {
        text,
        clinic_id,
        owner_id: logged_in_id,
      },
    });

    res.status(200).json(comment);
  } catch (e) {
    console.log(e);
  }
};

export const editCommentClinic = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    const { logged_in_id } = req.headers;

    if (!id || id === "") return res.status(400).json("Missing fields");

    const { text } = req.body;

    if (!text) return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const user = await prisma.user.findUnique({
      where: {
        id: logged_in_id,
      },
    });

    if (!user) return res.status(404).json("User not found");

    const doesCommentExist = await prisma.commentClinic.findUnique({
      where: {
        id: id,
      },
    });

    if (!doesCommentExist) return res.status(404).json("Comment not found");
    if (doesCommentExist.owner_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const comment = await prisma.commentClinic.update({
      where: {
        id,
      },
      data: {
        text,
      },
    });

    res.status(200).json(comment);
  } catch (e) {
    console.log(e);
  }
};

export const deleteCommentClinic = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") return res.status(400).json("Missing fields");

    const { logged_in_id } = req.headers;

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const doesCommentExist = await prisma.commentClinic.findUnique({
      where: {
        id: id,
      },
    });

    if (!doesCommentExist) return res.status(404).json("Comment not found");
    if (doesCommentExist.owner_id != logged_in_id)
      return res.status(401).json("Unauthorized");

    const comment = await prisma.commentClinic.delete({
      where: {
        id,
      },
    });

    res.status(200).json(comment);
  } catch (e) {
    console.log(e);
  }
};

export const reportVetComment = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") return res.status(400).json("Missing fields");

    const { logged_in_id } = req.headers;

    const { user_type } = req.body;

    if (!user_type) return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const doesCommentExist = await prisma.commentVet.findUnique({
      where: {
        id: id,
      },
    });

    if (!doesCommentExist) return res.status(404).json("Comment not found");

    let user;

    if (user_type === "user") {
      user = await prisma.user.findUnique({
        where: {
          id: logged_in_id,
        },
      });
    } else if (user_type === "vet") {
      user = await prisma.vet.findUnique({
        where: {
          id: logged_in_id,
        },
      });
    } else {
      return res.status(400).json("Invalid user type");
    }

    if (!user) return res.status(404).json("User not found");

    const report = await prisma.commentVetReport.create({
      data: {
        reported_by: logged_in_id,
        comment_id: id,
        reporter_type: user_type,
      },
    });

    res.status(200).json(report);
  } catch (e) {
    console.log(e);
  }
};

export const reportClinicComment = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") return res.status(400).json("Missing fields");

    const { logged_in_id } = req.headers;

    const { user_type } = req.body;

    if (!user_type) return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

    const doesCommentExist = await prisma.commentClinic.findUnique({
      where: {
        id: id,
      },
    });

    if (!doesCommentExist) return res.status(404).json("Comment not found");

    let user;

    if (user_type === "user") {
      user = await prisma.user.findUnique({
        where: {
          id: logged_in_id,
        },
      });
    } else if (user_type === "vet") {
      user = await prisma.vet.findUnique({
        where: {
          id: logged_in_id,
        },
      });
    } else {
      return res.status(400).json("Invalid user type");
    }

    if (!user) return res.status(404).json("User not found");

    const report = await prisma.commentClinicReport.create({
      data: {
        reported_by: logged_in_id,
        comment_id: id,
        reporter_type: user_type,
      },
    });

    res.status(200).json(report);
  } catch (e) {
    console.log(e);
  }
};
