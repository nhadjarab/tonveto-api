import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleTokenVerification } from "../authentication/authentication";
import validator from "validator";

export const addPayment = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { amount, vet_id, user_id, appointment_id, payment_id } = req.body;

    if (
      amount == undefined ||
      vet_id == undefined ||
      user_id == undefined ||
      appointment_id == undefined ||
      payment_id == undefined
    )
      return res.status(400).json("Missing fields");

    if (!validator.isNumeric(amount))
      return res.status(400).json("Invalid amount");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != user_id) return res.status(401).json("Unauthorized");

    const doesUserExist = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!doesUserExist) return res.status(404).json("Pet owner does not exist");

    const doesVetExist = await prisma.vet.findUnique({
      where: {
        id: vet_id,
      },
    });

    if (!doesVetExist) return res.status(404).json("Vet does not exist");

    const doesAppointmentExist = await prisma.appointment.findUnique({
      where: {
        id: appointment_id,
      },
    });

    if (!doesAppointmentExist)
      return res.status(404).json("Appointment does not exist");

    const isAlreadyPaid = await prisma.pendingPayment.findFirst({
      where: {
        appointment_id: appointment_id,
      },
    });

    if (isAlreadyPaid) return res.status(400).json("Appointment already paid");

    const newPayment = await prisma.pendingPayment.create({
      data: {
        amount: parseFloat(amount),
        vet_id,
        user_id,
        appointment_id,
        payment_id,
      },
    });

    res.status(200).json(newPayment);
  } catch (e) {
    console.log(e);
  }
};



