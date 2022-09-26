import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleTokenVerification } from "../authentication/authentication";
import validator from "validator";

import sgMail from "@sendgrid/mail";


sgMail.setApiKey(process.env.SENDGRID as string);

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
      include: {
        pet: true,
        clinic: true,
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

    const msg = {
      to: doesUserExist.email, // Change to your recipient
      from: "info@tonveto.com", // Change to your verified sender
      subject: "VetoLib Appointment",
      html: `<div><strong>Dear ${doesUserExist.first_name} ${
        doesUserExist.last_name
      }</strong> <span> Has booked an appointment with Doctor ${
        doesVetExist.first_name
      } ${doesVetExist.last_name} on ${doesAppointmentExist.date} ${
        doesAppointmentExist.time
      } for pet: ${doesAppointmentExist.pet!.name}, in ${
        doesAppointmentExist.clinic!.name
      } clinic</span></div>
    `,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    res.status(200).json(newPayment);
  } catch (e) {
    console.log(e);
  }
};
