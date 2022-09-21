import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { handleTokenVerification } from "../authentication/authentication";
import { weekDays } from "../../utils/helps";
import moment from "moment";
import Stripe from "stripe";

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID as string);

const stripe = new Stripe(process.env.STRIPE_KEY as string, {
  apiVersion: "2022-08-01",
});

export const addAppointment = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { date, time, pet_id, vet_id, user_id } = req.body;

    if (
      date == undefined ||
      time == undefined ||
      pet_id == undefined ||
      vet_id == undefined ||
      user_id == undefined
    )
      return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != user_id) return res.status(401).json("Unauthorized");

    if (!moment(date).isValid()) return res.status(400).json("Invalid date");

    const dayDifferece = moment(`${date} ${time}`).diff(moment(), "minutes");

    if (dayDifferece < 0)
      return res.status(400).json("Cannot schedule past dates");

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

    if (!doesVetExist.is_approved)
      return res.status(400).json("Vet is not approved yet");

    const dateValue = new Date(date);
    const day = dateValue.getDay() as number;

    const weekDay = (weekDays as any)[day];

    const vetCalender = await prisma.calendar.findUnique({
      where: {
        owner_id: vet_id,
      },
    });

    if (!JSON.parse((vetCalender as any)[weekDay]))
      return res.status(400).json("Vet is not available on this day");

    if (parseInt(time.split(":")[1]) % 20 != 0) {
      return res.status(400).json("Time must be in increments of 20 minutes");
    }
    const weekDayWorkingHours = JSON.parse((vetCalender as any)[weekDay]);

    if (weekDayWorkingHours === "closed")
      return res.status(400).json("Vet is not available on this day");

    const isBetweenWorkingHours =
      moment(`${date}  ${time}`).isBetween(
        `${date}  ${weekDayWorkingHours.morning.start_at}`,
        `${date}  ${weekDayWorkingHours.morning.end_at}`
      ) ||
      moment(`${date}  ${time}`).isBetween(
        `${date}  ${weekDayWorkingHours.afternoon.start_at}`,
        `${date}  ${weekDayWorkingHours.afternoon.end_at}`
      );

    if (!isBetweenWorkingHours)
      return res.status(400).json("Vet is not available at this time");

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        vet_id,
        date,
        time,
      },
    });

    if (existingAppointment)
      return res.status(400).json("Appointment at that time already exists");

    const newAppointment = await prisma.appointment.create({
      data: {
        date,
        time,
        pet_id,
        vet_id,
        user_id,
      },
    });

    const msg = {
      to: doesUserExist.email, // Change to your recipient
      from: "info@aimensahnoun.com", // Change to your verified sender
      subject: "VetoLib Appointment",
      html: `<div><strong>Dear ${doesUserExist.first_name} ${doesUserExist.last_name}</strong> <span> Has booked an appointment with Doctor ${doesVetExist.first_name} ${doesVetExist.last_name} on ${date} ${time} for pet: ${doesPetExist.name}</span></div>
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

    res.status(201).json(newAppointment);
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

    if (!id || id === "") return res.status(400).json("Missing id");

    const { date, time, pet_id, vet_id, user_id } = req.body;

    if (
      date == undefined ||
      time == undefined ||
      pet_id == undefined ||
      vet_id == undefined ||
      user_id == undefined
    )
      return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != user_id) return res.status(401).json("Unauthorized");

    if (!moment(date).isValid()) return res.status(400).json("Invalid date");

    const dayDifferece = moment(`${date} ${time}`).diff(moment(), "minutes");

    if (dayDifferece < 0)
      return res.status(400).json("Cannot schedule past dates");

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

    if (!doesVetExist.is_approved)
      return res.status(400).json("Vet is not approved yet");

    const oldAppointment = await prisma.appointment.findUnique({
      where: {
        id,
      },
    });

    if (!oldAppointment) return res.status(404).json("Appointment not found");

    if (!oldAppointment.user_id == user_id)
      return res.status(401).json("Unauthorized");

    const dateValue = new Date(date);
    const day = dateValue.getDay() as number;

    const weekDay = (weekDays as any)[day];

    const vetCalender = await prisma.calendar.findUnique({
      where: {
        owner_id: vet_id,
      },
    });

    if (!JSON.parse((vetCalender as any)[weekDay]))
      return res.status(400).json("Vet is not available on this day");

    if (parseInt(time.split(":")[1]) % 20 != 0) {
      return res.status(400).json("Time must be in increments of 20 minutes");
    }
    const weekDayWorkingHours = JSON.parse((vetCalender as any)[weekDay]);

    if (weekDayWorkingHours === "closed")
      return res.status(400).json("Vet is not available on this day");

    const isBetweenWorkingHours =
      moment(`${date}  ${time}`).isBetween(
        `${date}  ${weekDayWorkingHours.morning.start_at}`,
        `${date}  ${weekDayWorkingHours.morning.end_at}`
      ) ||
      moment(`${date}  ${time}`).isBetween(
        `${date}  ${weekDayWorkingHours.afternoon.start_at}`,
        `${date}  ${weekDayWorkingHours.afternoon.end_at}`
      );

    if (!isBetweenWorkingHours)
      return res.status(400).json("Vet is not available at this time");

    const newAppointment = await prisma.appointment.update({
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

    const msg = {
      to: doesUserExist.email, // Change to your recipient
      from: "info@aimensahnoun.com", // Change to your verified sender
      subject: "VetoLib Appointment Update",
      html: `<div><strong>Dear ${doesUserExist.first_name} ${doesUserExist.last_name}</strong> <span> Has booked an appointment with Doctor ${doesVetExist.first_name} ${doesVetExist.last_name} on ${date} ${time} for pet: ${doesPetExist.name}</span></div>
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

    res.status(200).json(newAppointment);
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

    if (!id || id === "") return res.status(400).json("Missing id");

    const { logged_in_id } = req.headers;

    if (!logged_in_id) return res.status(400).json("Missing logged in id");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != logged_in_id)
      return res.status(401).json("Unauthorized");

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

    if (!id || id === "") return res.status(400).json("Missing id");

    const { user_id } = req.headers;

    if (user_id == undefined) return res.status(400).json("Missing user_id");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != user_id) return res.status(401).json("Unauthorized");

    const doesUserExist = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!doesUserExist) return res.status(404).json("User not found");

    const doesAppointmentExist = await prisma.appointment.findUnique({
      where: {
        id,
      },
    });

    if (!doesAppointmentExist)
      return res.status(404).json("Appointment not found");

    const dayDifferece = moment(
      `${doesAppointmentExist.date} ${doesAppointmentExist.time}`
    ).diff(moment(), "minutes");

    if (dayDifferece < 0)
      return res.status(400).json("Cannot schedule past dates");

    const payment = await prisma.pendingPayment.findFirst({
      where: {
        appointment_id: id,
      },
    });

    if (payment) {
      await stripe.refunds.create({
        payment_intent: payment.payment_id,
      });

      await prisma.pendingPayment.delete({
        where: {
          id: payment.id,
        },
      });
    }

    const appointment = await prisma.appointment.delete({
      where: {
        id,
      },
    });

    if (!appointment) return res.status(404).json("Appointment not found");

    const msg = {
      to: doesUserExist.email, // Change to your recipient
      from: "info@aimensahnoun.com", // Change to your verified sender
      subject: "VetoLib Appointment Cancelled",
      html: `<div><strong>Dear ${doesUserExist.first_name} ${doesUserExist.last_name}</strong> <span> Has canceled an appointment with id ${appointment.id} successfully </span></div>
    `,
    };

    res.status(200).json("Appointment canceled successfully");
  } catch (e) {
    console.log(e);
  }
};

export const closeTimeSlot = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { date, time, vet_id } = req.body;

    if (date == undefined || time == undefined || vet_id == undefined)
      return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != vet_id) return res.status(401).json("Unauthorized");

    if (!moment(date).isValid()) return res.status(400).json("Invalid date");

    const doesVetExist = await prisma.vet.findUnique({
      where: {
        id: vet_id,
      },
    });

    if (!doesVetExist)
      return res.status(404).json(`Vet with id:${vet_id} does not exist`);

    if (!doesVetExist.is_approved)
      return res.status(400).json("Vet is not approved yet");

    const dateValue = new Date(date);
    const day = dateValue.getDay() as number;

    const weekDay = (weekDays as any)[day];

    const vetCalender = await prisma.calendar.findUnique({
      where: {
        owner_id: vet_id,
      },
    });

    if (!JSON.parse((vetCalender as any)[weekDay]))
      return res.status(400).json("Vet is not available on this day");

    if (parseInt(time.split(":")[1]) % 20 != 0) {
      return res.status(400).json("Time must be in increments of 20 minutes");
    }
    const weekDayWorkingHours = JSON.parse((vetCalender as any)[weekDay]);

    if (weekDayWorkingHours === "closed")
      return res.status(400).json("Vet is not available on this day");

    const isBetweenWorkingHours =
      moment(`${date}  ${time}`).isBetween(
        `${date}  ${weekDayWorkingHours.morning.start_at}`,
        `${date}  ${weekDayWorkingHours.morning.end_at}`
      ) ||
      moment(`${date}  ${time}`).isBetween(
        `${date}  ${weekDayWorkingHours.afternoon.start_at}`,
        `${date}  ${weekDayWorkingHours.afternoon.end_at}`
      );

    if (!isBetweenWorkingHours)
      return res.status(400).json("Vet is not available at this time");

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        vet_id,
        date,
        time,
      },
    });

    if (existingAppointment) {
      if (
        existingAppointment.user_id === process.env.DEFAULT_USER_ID &&
        existingAppointment.pet_id === process.env.DEFAULT_PET_ID
      ) {
        return res.status(400).json("Time slot is already closed");
      }

      const deletedAppointment = await prisma.appointment.delete({
        where: {
          id: existingAppointment.id,
        },
      });

      const user = await prisma.user.findUnique({
        where: {
          id: existingAppointment.user_id as string,
        },
        select: {
          email: true,
          first_name: true,
          last_name: true,
        },
      });

      const msg = {
        to: user?.email, // Change to your recipient
        from: "info@aimensahnoun.com", // Change to your verified sender
        subject: "VetoLib Appointment Cancelled By Vet",
        html: `<div><strong>Dear ${user?.first_name} ${user?.last_name}</strong> <span> Has been canclled by the vet, you are welcome to book another appointment at another time.</span></div>
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
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        date,
        time,
        pet_id: process.env.DEFAULT_PET_ID,
        vet_id,
        user_id: process.env.DEFAULT_USER_ID,
      },
    });

    res.status(200).json(newAppointment);
  } catch (e) {
    console.log(e);
  }
};

export const openTimeSlot = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { date, time, vet_id } = req.body;

    if (date == undefined || time == undefined || vet_id == undefined)
      return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != vet_id) return res.status(401).json("Unauthorized");

    if (!moment(date).isValid()) return res.status(400).json("Invalid date");

    const doesVetExist = await prisma.vet.findUnique({
      where: {
        id: vet_id,
      },
    });

    if (!doesVetExist)
      return res.status(404).json(`Vet with id:${vet_id} does not exist`);

    if (!doesVetExist.is_approved)
      return res.status(400).json("Vet is not approved yet");

    const dateValue = new Date(date);
    const day = dateValue.getDay() as number;

    const weekDay = (weekDays as any)[day];

    const vetCalender = await prisma.calendar.findUnique({
      where: {
        owner_id: vet_id,
      },
    });

    if (!JSON.parse((vetCalender as any)[weekDay]))
      return res.status(400).json("Vet is not available on this day");

    if (parseInt(time.split(":")[1]) % 20 != 0) {
      return res.status(400).json("Time must be in increments of 20 minutes");
    }
    const weekDayWorkingHours = JSON.parse((vetCalender as any)[weekDay]);

    if (weekDayWorkingHours === "closed")
      return res.status(400).json("Vet is not available on this day");

    const isBetweenWorkingHours =
      moment(`${date}  ${time}`).isBetween(
        `${date}  ${weekDayWorkingHours.morning.start_at}`,
        `${date}  ${weekDayWorkingHours.morning.end_at}`
      ) ||
      moment(`${date}  ${time}`).isBetween(
        `${date}  ${weekDayWorkingHours.afternoon.start_at}`,
        `${date}  ${weekDayWorkingHours.afternoon.end_at}`
      );

    if (!isBetweenWorkingHours)
      return res.status(400).json("Vet is not available at this time");

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        vet_id,
        date,
        time,
      },
    });

    if (!existingAppointment)
      return res.status(400).json("Timeslot already open");

    const newAppointment = await prisma.appointment.delete({
      where: {
        id: existingAppointment.id,
      },
    });

    res.status(200).json(newAppointment);
  } catch (e) {
    console.log(e);
  }
};

export const addAppointmentVet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { date, time, pet_id, vet_id, user_id } = req.body;

    if (
      date == undefined ||
      time == undefined ||
      pet_id == undefined ||
      vet_id == undefined ||
      user_id == undefined
    )
      return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != vet_id) return res.status(401).json("Unauthorized");

    if (!moment(date).isValid()) return res.status(400).json("Invalid date");

    const dayDifferece = moment(`${date} ${time}`).diff(moment(), "minutes");

    if (dayDifferece < 0)
      return res.status(400).json("Cannot schedule past dates");

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

    if (!doesVetExist.is_approved)
      return res.status(400).json("Vet is not approved yet");

    const dateValue = new Date(date);
    const day = dateValue.getDay() as number;

    const weekDay = (weekDays as any)[day];

    const vetCalender = await prisma.calendar.findUnique({
      where: {
        owner_id: vet_id,
      },
    });

    if (!JSON.parse((vetCalender as any)[weekDay]))
      return res.status(400).json("Vet is not available on this day");

    if (parseInt(time.split(":")[1]) % 20 != 0) {
      return res.status(400).json("Time must be in increments of 20 minutes");
    }
    const weekDayWorkingHours = JSON.parse((vetCalender as any)[weekDay]);

    if (weekDayWorkingHours === "closed")
      return res.status(400).json("Vet is not available on this day");

    const isBetweenWorkingHours =
      moment(`${date}  ${time}`).isBetween(
        `${date}  ${weekDayWorkingHours.morning.start_at}`,
        `${date}  ${weekDayWorkingHours.morning.end_at}`
      ) ||
      moment(`${date}  ${time}`).isBetween(
        `${date}  ${weekDayWorkingHours.afternoon.start_at}`,
        `${date}  ${weekDayWorkingHours.afternoon.end_at}`
      );

    if (!isBetweenWorkingHours)
      return res.status(400).json("Vet is not available at this time");

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        vet_id,
        date,
        time,
      },
    });

    if (existingAppointment)
      return res.status(400).json("Appointment at that time already exists");

    const newAppointment = await prisma.appointment.create({
      data: {
        date,
        time,
        pet_id,
        vet_id,
        user_id,
      },
    });

    const msg = {
      to: doesUserExist.email, // Change to your recipient
      from: "info@aimensahnoun.com", // Change to your verified sender
      subject: "VetoLib Appointment",
      html: `<div><strong>Dear ${doesUserExist.first_name} ${doesUserExist.last_name}</strong> <span> Has booked an appointment with Doctor ${doesVetExist.first_name} ${doesVetExist.last_name} on ${date} ${time} for pet: ${doesPetExist.name}</span></div>
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

    res.status(201).json(newAppointment);
  } catch (e) {
    console.log(e);
  }
};

export const updateAppointmentVet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") return res.status(400).json("Missing id");

    const { date, time, pet_id, vet_id, user_id } = req.body;

    if (
      date == undefined ||
      time == undefined ||
      pet_id == undefined ||
      vet_id == undefined ||
      user_id == undefined
    )
      return res.status(400).json("Missing fields");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != vet_id) return res.status(401).json("Unauthorized");

    if (!moment(date).isValid()) return res.status(400).json("Invalid date");

    const dayDifferece = moment(`${date} ${time}`).diff(moment(), "minutes");

    if (dayDifferece < 0)
      return res.status(400).json("Cannot schedule past dates");

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

    if (!doesVetExist.is_approved)
      return res.status(400).json("Vet is not approved yet");

    const oldAppointment = await prisma.appointment.findUnique({
      where: {
        id,
      },
    });

    if (!oldAppointment) return res.status(404).json("Appointment not found");

    if (!oldAppointment.vet_id == vet_id)
      return res.status(401).json("Unauthorized");

    const dateValue = new Date(date);
    const day = dateValue.getDay() as number;

    const weekDay = (weekDays as any)[day];

    const vetCalender = await prisma.calendar.findUnique({
      where: {
        owner_id: vet_id,
      },
    });

    if (!JSON.parse((vetCalender as any)[weekDay]))
      return res.status(400).json("Vet is not available on this day");

    if (parseInt(time.split(":")[1]) % 20 != 0) {
      return res.status(400).json("Time must be in increments of 20 minutes");
    }
    const weekDayWorkingHours = JSON.parse((vetCalender as any)[weekDay]);

    if (weekDayWorkingHours === "closed")
      return res.status(400).json("Vet is not available on this day");

    const isBetweenWorkingHours =
      moment(`${date}  ${time}`).isBetween(
        `${date}  ${weekDayWorkingHours.morning.start_at}`,
        `${date}  ${weekDayWorkingHours.morning.end_at}`
      ) ||
      moment(`${date}  ${time}`).isBetween(
        `${date}  ${weekDayWorkingHours.afternoon.start_at}`,
        `${date}  ${weekDayWorkingHours.afternoon.end_at}`
      );

    if (!isBetweenWorkingHours)
      return res.status(400).json("Vet is not available at this time");

    const newAppointment = await prisma.appointment.update({
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

    const msg = {
      to: doesUserExist.email, // Change to your recipient
      from: "info@aimensahnoun.com", // Change to your verified sender
      subject: "VetoLib Appointment Update",
      html: `<div><strong>Dear ${doesUserExist.first_name} ${doesUserExist.last_name}</strong> <span> Has booked an appointment with Doctor ${doesVetExist.first_name} ${doesVetExist.last_name} on ${date} ${time} for pet: ${doesPetExist.name}</span></div>
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

    res.status(200).json(newAppointment);
  } catch (e) {
    console.log(e);
  }
};

export const cancelAppointmentVet = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  try {
    const { id } = req.params;

    if (!id || id === "") return res.status(400).json("Missing id");

    const { vet_id } = req.headers;

    if (vet_id == undefined) return res.status(400).json("Missing user_id");

    const payload: JWTPayload = handleTokenVerification(req, res) as JWTPayload;

    if (payload.userId != vet_id) return res.status(401).json("Unauthorized");

    const doesUserExist = await prisma.vet.findUnique({
      where: {
        id: vet_id,
      },
    });

    if (!doesUserExist) return res.status(404).json("Vet not found");

    const doesAppointmentExist = await prisma.appointment.findUnique({
      where: {
        id,
      },
    });

    if (!doesAppointmentExist)
      return res.status(404).json("Appointment not found");

    const dayDifferece = moment(
      `${doesAppointmentExist.date} ${doesAppointmentExist.time}`
    ).diff(moment(), "minutes");

    if (dayDifferece < 0)
      return res.status(400).json("Cannot schedule past dates");

    const payment = await prisma.pendingPayment.findFirst({
      where: {
        appointment_id: id,
      },
    });

    if (payment) {
      await stripe.refunds.create({
        payment_intent: payment.payment_id,
      });

      await prisma.pendingPayment.delete({
        where: {
          id: payment.id,
        },
      });
    }

    const appointment = await prisma.appointment.delete({
      where: {
        id,
      },
    });

    if (!appointment) return res.status(404).json("Appointment not found");

    const msg = {
      to: doesUserExist.email, // Change to your recipient
      from: "info@aimensahnoun.com", // Change to your verified sender
      subject: "VetoLib Appointment Cancelled",
      html: `<div><strong>Dear ${doesUserExist.first_name} ${doesUserExist.last_name}</strong> <span> Has canceled an appointment with id ${appointment.id} successfully </span></div>
    `,
    };

    res.status(200).json("Appointment canceled successfully");
  } catch (e) {
    console.log(e);
  }
};
