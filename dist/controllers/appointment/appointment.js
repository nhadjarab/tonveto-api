"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableAppointments = exports.cancelAppointmentVet = exports.updateAppointmentVet = exports.addAppointmentVet = exports.openTimeSlot = exports.closeTimeSlot = exports.cancelAppointments = exports.getAppointment = exports.updateAppointment = exports.addAppointment = void 0;
const authentication_1 = require("../authentication/authentication");
const helps_1 = require("../../utils/helps");
const moment_1 = __importDefault(require("moment"));
const stripe_1 = __importDefault(require("stripe"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey(process.env.SENDGRID);
const stripe = new stripe_1.default(process.env.STRIPE_KEY, {
    apiVersion: "2022-08-01",
});
const addAppointment = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, time, pet_id, vet_id, user_id, clinic_id } = req.body;
        if (date == undefined ||
            time == undefined ||
            pet_id == undefined ||
            vet_id == undefined ||
            user_id == undefined ||
            clinic_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != user_id)
            return res.status(401).json("Unauthorized");
        if (!(0, moment_1.default)(date).isValid())
            return res.status(400).json("Invalid date");
        const dayDifferece = (0, moment_1.default)(`${date} ${time}`).diff((0, moment_1.default)(), "minutes");
        if (dayDifferece < 0)
            return res.status(400).json("Cannot schedule past dates");
        const doesUserExist = yield prisma.user.findUnique({
            where: {
                id: user_id,
            },
        });
        if (!doesUserExist)
            return res.status(404).json(`User with id:${user_id} does not exist`);
        const doesPetExist = yield prisma.pet.findUnique({
            where: {
                id: pet_id,
            },
        });
        if (!doesPetExist)
            return res.status(404).json(`Pet with id:${pet_id} does not exist`);
        const doesVetExist = yield prisma.vet.findUnique({
            where: {
                id: vet_id,
            },
        });
        if (!doesVetExist)
            return res.status(404).json(`Vet with id:${vet_id} does not exist`);
        if (!doesVetExist.is_approved)
            return res.status(400).json("Vet is not approved yet");
        const doesClinicExist = yield prisma.clinic.findUnique({
            where: {
                id: clinic_id,
            },
        });
        if (!doesClinicExist)
            return res.status(404).json(`Clinic with id:${clinic_id} does not exist`);
        if (!doesClinicExist.is_approved)
            return res.status(400).json("Clinic is not approved yet");
        const dateValue = new Date(date);
        const day = dateValue.getDay();
        const weekDay = helps_1.weekDays[day];
        const vetCalender = yield prisma.calendar.findUnique({
            where: {
                owner_id: vet_id,
            },
        });
        if (!JSON.parse(vetCalender[weekDay]))
            return res.status(400).json("Vet is not available on this day");
        if (parseInt(time.split(":")[1]) % 30 != 0) {
            return res.status(400).json("Time must be in increments of 30 minutes");
        }
        const weekDayWorkingHours = JSON.parse(vetCalender[weekDay]);
        if (weekDayWorkingHours === "closed")
            return res.status(400).json("Vet is not available on this day");
        const isBetweenWorkingHours = (0, moment_1.default)(`${date}  ${time}`).isBetween(`${date}  ${weekDayWorkingHours.morning.start_at}`, `${date}  ${weekDayWorkingHours.morning.end_at}`) ||
            (0, moment_1.default)(`${date}  ${time}`).isBetween(`${date}  ${weekDayWorkingHours.afternoon.start_at}`, `${date}  ${weekDayWorkingHours.afternoon.end_at}`);
        if (!isBetweenWorkingHours)
            return res.status(400).json("Vet is not available at this time");
        const existingAppointment = yield prisma.appointment.findFirst({
            where: {
                vet_id,
                date,
                time,
            },
        });
        if (existingAppointment)
            return res.status(400).json("Appointment at that time already exists");
        const newAppointment = yield prisma.appointment.create({
            data: {
                date,
                time,
                pet_id,
                vet_id,
                user_id,
                clinic_id,
            },
        });
        res.status(201).json(newAppointment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.addAppointment = addAppointment;
const updateAppointment = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "")
            return res.status(400).json("Missing id");
        const { date, time, pet_id, vet_id, user_id } = req.body;
        if (date == undefined ||
            time == undefined ||
            pet_id == undefined ||
            vet_id == undefined ||
            user_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != user_id)
            return res.status(401).json("Unauthorized");
        if (!(0, moment_1.default)(date).isValid())
            return res.status(400).json("Invalid date");
        const dayDifferece = (0, moment_1.default)(`${date} ${time}`).diff((0, moment_1.default)(), "minutes");
        if (dayDifferece < 0)
            return res.status(400).json("Cannot schedule past dates");
        const doesUserExist = yield prisma.user.findUnique({
            where: {
                id: user_id,
            },
        });
        if (!doesUserExist)
            return res.status(404).json(`User with id:${user_id} does not exist`);
        const doesPetExist = yield prisma.pet.findUnique({
            where: {
                id: pet_id,
            },
        });
        if (!doesPetExist)
            return res.status(404).json(`Pet with id:${pet_id} does not exist`);
        const doesVetExist = yield prisma.vet.findUnique({
            where: {
                id: vet_id,
            },
        });
        if (!doesVetExist)
            return res.status(404).json(`Vet with id:${vet_id} does not exist`);
        if (!doesVetExist.is_approved)
            return res.status(400).json("Vet is not approved yet");
        const oldAppointment = yield prisma.appointment.findUnique({
            where: {
                id,
            },
        });
        if (!oldAppointment)
            return res.status(404).json("Appointment not found");
        if (!oldAppointment.user_id == user_id)
            return res.status(401).json("Unauthorized");
        const dateValue = new Date(date);
        const day = dateValue.getDay();
        const weekDay = helps_1.weekDays[day];
        const vetCalender = yield prisma.calendar.findUnique({
            where: {
                owner_id: vet_id,
            },
        });
        if (!JSON.parse(vetCalender[weekDay]))
            return res.status(400).json("Vet is not available on this day");
        if (parseInt(time.split(":")[1]) % 30 != 0) {
            return res.status(400).json("Time must be in increments of 30 minutes");
        }
        const weekDayWorkingHours = JSON.parse(vetCalender[weekDay]);
        if (weekDayWorkingHours === "closed")
            return res.status(400).json("Vet is not available on this day");
        const isBetweenWorkingHours = (0, moment_1.default)(`${date}  ${time}`).isBetween(`${date}  ${weekDayWorkingHours.morning.start_at}`, `${date}  ${weekDayWorkingHours.morning.end_at}`) ||
            (0, moment_1.default)(`${date}  ${time}`).isBetween(`${date}  ${weekDayWorkingHours.afternoon.start_at}`, `${date}  ${weekDayWorkingHours.afternoon.end_at}`);
        if (!isBetweenWorkingHours)
            return res.status(400).json("Vet is not available at this time");
        const newAppointment = yield prisma.appointment.update({
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
            to: doesUserExist.email,
            from: "info@tonveto.com",
            subject: "VetoLib Appointment Update",
            html: `<div><strong>Dear ${doesUserExist.first_name} ${doesUserExist.last_name}</strong> <span> Has booked an appointment with Doctor ${doesVetExist.first_name} ${doesVetExist.last_name} on ${date} ${time} for pet: ${doesPetExist.name}</span></div>
    `,
        };
        mail_1.default
            .send(msg)
            .then(() => {
            console.log("Email sent");
        })
            .catch((error) => {
            console.error(error);
        });
        res.status(200).json(newAppointment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.updateAppointment = updateAppointment;
const getAppointment = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "")
            return res.status(400).json("Missing id");
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const appointment = yield prisma.appointment.findUnique({
            where: {
                id,
            },
            include: {
                pet: true,
                vet: true,
                user: true,
                clinic: true,
            },
        });
        if (!appointment)
            return res.status(404).json("Appointment not found");
        res.status(200).json(appointment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getAppointment = getAppointment;
const cancelAppointments = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "")
            return res.status(400).json("Missing id");
        const { user_id } = req.headers;
        if (user_id == undefined)
            return res.status(400).json("Missing user_id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != user_id)
            return res.status(401).json("Unauthorized");
        const doesUserExist = yield prisma.user.findUnique({
            where: {
                id: user_id,
            },
        });
        if (!doesUserExist)
            return res.status(404).json("User not found");
        const doesAppointmentExist = yield prisma.appointment.findUnique({
            where: {
                id,
            },
        });
        if (!doesAppointmentExist)
            return res.status(404).json("Appointment not found");
        const dayDifferece = (0, moment_1.default)(`${doesAppointmentExist.date} ${doesAppointmentExist.time}`).diff((0, moment_1.default)(), "minutes");
        if (dayDifferece < 0)
            return res.status(400).json("Cannot schedule past dates");
        const payment = yield prisma.pendingPayment.findFirst({
            where: {
                appointment_id: id,
            },
        });
        console.log(payment);
        if (payment) {
            yield stripe.refunds.create({
                payment_intent: payment.payment_id,
            });
            yield prisma.pendingPayment.delete({
                where: {
                    id: payment.id,
                },
            });
        }
        const appointment = yield prisma.appointment.delete({
            where: {
                id,
            },
        });
        if (!appointment)
            return res.status(404).json("Appointment not found");
        if (payment) {
            const msg = {
                to: doesUserExist.email,
                from: "info@tonveto.com",
                subject: "VetoLib Appointment Cancelled",
                html: `<div><strong>Dear ${doesUserExist.first_name} ${doesUserExist.last_name}</strong> <span> Has canceled an appointment with id ${appointment.id} successfully </span></div>
      `,
            };
            mail_1.default
                .send(msg)
                .then(() => {
                console.log("Email sent");
            })
                .catch((error) => {
                console.error(error);
            });
        }
        res.status(200).json("Appointment canceled successfully");
    }
    catch (e) {
        console.log(e);
    }
});
exports.cancelAppointments = cancelAppointments;
const closeTimeSlot = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, time, vet_id } = req.body;
        if (date == undefined || time == undefined || vet_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != vet_id)
            return res.status(401).json("Unauthorized");
        if (!(0, moment_1.default)(date).isValid())
            return res.status(400).json("Invalid date");
        const doesVetExist = yield prisma.vet.findUnique({
            where: {
                id: vet_id,
            },
        });
        if (!doesVetExist)
            return res.status(404).json(`Vet with id:${vet_id} does not exist`);
        if (!doesVetExist.is_approved)
            return res.status(400).json("Vet is not approved yet");
        const dateValue = new Date(date);
        const day = dateValue.getDay();
        const weekDay = helps_1.weekDays[day];
        const vetCalender = yield prisma.calendar.findUnique({
            where: {
                owner_id: vet_id,
            },
        });
        if (!JSON.parse(vetCalender[weekDay]))
            return res.status(400).json("Vet is not available on this day");
        if (parseInt(time.split(":")[1]) % 30 != 0) {
            return res.status(400).json("Time must be in increments of 30 minutes");
        }
        const weekDayWorkingHours = JSON.parse(vetCalender[weekDay]);
        if (weekDayWorkingHours === "closed")
            return res.status(400).json("Vet is not available on this day");
        const isBetweenWorkingHours = (0, moment_1.default)(`${date}  ${time}`).isBetween(`${date}  ${weekDayWorkingHours.morning.start_at}`, `${date}  ${weekDayWorkingHours.morning.end_at}`) ||
            (0, moment_1.default)(`${date}  ${time}`).isBetween(`${date}  ${weekDayWorkingHours.afternoon.start_at}`, `${date}  ${weekDayWorkingHours.afternoon.end_at}`);
        if (!isBetweenWorkingHours)
            return res.status(400).json("Vet is not available at this time");
        const existingAppointment = yield prisma.appointment.findFirst({
            where: {
                vet_id,
                date,
                time,
            },
        });
        if (existingAppointment) {
            if (existingAppointment.user_id === process.env.DEFAULT_USER_ID &&
                existingAppointment.pet_id === process.env.DEFAULT_PET_ID) {
                return res.status(400).json("Time slot is already closed");
            }
            const deletedAppointment = yield prisma.appointment.delete({
                where: {
                    id: existingAppointment.id,
                },
            });
            const user = yield prisma.user.findUnique({
                where: {
                    id: existingAppointment.user_id,
                },
                select: {
                    email: true,
                    first_name: true,
                    last_name: true,
                },
            });
            const msg = {
                to: user === null || user === void 0 ? void 0 : user.email,
                from: "info@tonveto.com",
                subject: "VetoLib Appointment Cancelled By Vet",
                html: `<div><strong>Dear ${user === null || user === void 0 ? void 0 : user.first_name} ${user === null || user === void 0 ? void 0 : user.last_name}</strong> <span> Has been canclled by the vet, you are welcome to book another appointment at another time.</span></div>
      `,
            };
            mail_1.default
                .send(msg)
                .then(() => {
                console.log("Email sent");
            })
                .catch((error) => {
                console.error(error);
            });
        }
        const newAppointment = yield prisma.appointment.create({
            data: {
                date,
                time,
                pet_id: process.env.DEFAULT_PET_ID,
                vet_id,
                user_id: process.env.DEFAULT_USER_ID,
                clinic_id: "cl8eosxg000800umc64gdhs1j",
            },
        });
        res.status(200).json(newAppointment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.closeTimeSlot = closeTimeSlot;
const openTimeSlot = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, time, vet_id } = req.body;
        if (date == undefined || time == undefined || vet_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != vet_id)
            return res.status(401).json("Unauthorized");
        if (!(0, moment_1.default)(date).isValid())
            return res.status(400).json("Invalid date");
        const doesVetExist = yield prisma.vet.findUnique({
            where: {
                id: vet_id,
            },
        });
        if (!doesVetExist)
            return res.status(404).json(`Vet with id:${vet_id} does not exist`);
        if (!doesVetExist.is_approved)
            return res.status(400).json("Vet is not approved yet");
        const dateValue = new Date(date);
        const day = dateValue.getDay();
        const weekDay = helps_1.weekDays[day];
        const vetCalender = yield prisma.calendar.findUnique({
            where: {
                owner_id: vet_id,
            },
        });
        if (!JSON.parse(vetCalender[weekDay]))
            return res.status(400).json("Vet is not available on this day");
        if (parseInt(time.split(":")[1]) % 30 != 0) {
            return res.status(400).json("Time must be in increments of 30 minutes");
        }
        const weekDayWorkingHours = JSON.parse(vetCalender[weekDay]);
        if (weekDayWorkingHours === "closed")
            return res.status(400).json("Vet is not available on this day");
        const isBetweenWorkingHours = (0, moment_1.default)(`${date}  ${time}`).isBetween(`${date}  ${weekDayWorkingHours.morning.start_at}`, `${date}  ${weekDayWorkingHours.morning.end_at}`) ||
            (0, moment_1.default)(`${date}  ${time}`).isBetween(`${date}  ${weekDayWorkingHours.afternoon.start_at}`, `${date}  ${weekDayWorkingHours.afternoon.end_at}`);
        if (!isBetweenWorkingHours)
            return res.status(400).json("Vet is not available at this time");
        const existingAppointment = yield prisma.appointment.findFirst({
            where: {
                vet_id,
                date,
                time,
            },
        });
        if (!existingAppointment)
            return res.status(400).json("Timeslot already open");
        const newAppointment = yield prisma.appointment.delete({
            where: {
                id: existingAppointment.id,
            },
        });
        res.status(200).json(newAppointment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.openTimeSlot = openTimeSlot;
const addAppointmentVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, time, pet_id, vet_id, user_id } = req.body;
        if (date == undefined ||
            time == undefined ||
            pet_id == undefined ||
            vet_id == undefined ||
            user_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != vet_id)
            return res.status(401).json("Unauthorized");
        if (!(0, moment_1.default)(date).isValid())
            return res.status(400).json("Invalid date");
        const dayDifferece = (0, moment_1.default)(`${date} ${time}`).diff((0, moment_1.default)(), "minutes");
        if (dayDifferece < 0)
            return res.status(400).json("Cannot schedule past dates");
        const doesUserExist = yield prisma.user.findUnique({
            where: {
                id: user_id,
            },
        });
        if (!doesUserExist)
            return res.status(404).json(`User with id:${user_id} does not exist`);
        const doesPetExist = yield prisma.pet.findUnique({
            where: {
                id: pet_id,
            },
        });
        if (!doesPetExist)
            return res.status(404).json(`Pet with id:${pet_id} does not exist`);
        const doesVetExist = yield prisma.vet.findUnique({
            where: {
                id: vet_id,
            },
        });
        if (!doesVetExist)
            return res.status(404).json(`Vet with id:${vet_id} does not exist`);
        if (!doesVetExist.is_approved)
            return res.status(400).json("Vet is not approved yet");
        const dateValue = new Date(date);
        const day = dateValue.getDay();
        const weekDay = helps_1.weekDays[day];
        const vetCalender = yield prisma.calendar.findUnique({
            where: {
                owner_id: vet_id,
            },
        });
        if (!JSON.parse(vetCalender[weekDay]))
            return res.status(400).json("Vet is not available on this day");
        if (parseInt(time.split(":")[1]) % 30 != 0) {
            return res.status(400).json("Time must be in increments of 30 minutes");
        }
        const weekDayWorkingHours = JSON.parse(vetCalender[weekDay]);
        if (weekDayWorkingHours === "closed")
            return res.status(400).json("Vet is not available on this day");
        const isBetweenWorkingHours = (0, moment_1.default)(`${date}  ${time}`).isBetween(`${date}  ${weekDayWorkingHours.morning.start_at}`, `${date}  ${weekDayWorkingHours.morning.end_at}`) ||
            (0, moment_1.default)(`${date}  ${time}`).isBetween(`${date}  ${weekDayWorkingHours.afternoon.start_at}`, `${date}  ${weekDayWorkingHours.afternoon.end_at}`);
        if (!isBetweenWorkingHours)
            return res.status(400).json("Vet is not available at this time");
        const existingAppointment = yield prisma.appointment.findFirst({
            where: {
                vet_id,
                date,
                time,
            },
        });
        if (existingAppointment)
            return res.status(400).json("Appointment at that time already exists");
        const newAppointment = yield prisma.appointment.create({
            data: {
                date,
                time,
                pet_id,
                vet_id,
                user_id,
            },
        });
        const msg = {
            to: doesUserExist.email,
            from: "info@tonveto.com",
            subject: "VetoLib Appointment",
            html: `<div><strong>Dear ${doesUserExist.first_name} ${doesUserExist.last_name}</strong> <span> Has booked an appointment with Doctor ${doesVetExist.first_name} ${doesVetExist.last_name} on ${date} ${time} for pet: ${doesPetExist.name}</span></div>
    `,
        };
        mail_1.default
            .send(msg)
            .then(() => {
            console.log("Email sent");
        })
            .catch((error) => {
            console.error(error);
        });
        res.status(201).json(newAppointment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.addAppointmentVet = addAppointmentVet;
const updateAppointmentVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "")
            return res.status(400).json("Missing id");
        const { date, time, pet_id, vet_id, user_id } = req.body;
        if (date == undefined ||
            time == undefined ||
            pet_id == undefined ||
            vet_id == undefined ||
            user_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != vet_id)
            return res.status(401).json("Unauthorized");
        if (!(0, moment_1.default)(date).isValid())
            return res.status(400).json("Invalid date");
        const dayDifferece = (0, moment_1.default)(`${date} ${time}`).diff((0, moment_1.default)(), "minutes");
        if (dayDifferece < 0)
            return res.status(400).json("Cannot schedule past dates");
        const doesUserExist = yield prisma.user.findUnique({
            where: {
                id: user_id,
            },
        });
        if (!doesUserExist)
            return res.status(404).json(`User with id:${user_id} does not exist`);
        const doesPetExist = yield prisma.pet.findUnique({
            where: {
                id: pet_id,
            },
        });
        if (!doesPetExist)
            return res.status(404).json(`Pet with id:${pet_id} does not exist`);
        const doesVetExist = yield prisma.vet.findUnique({
            where: {
                id: vet_id,
            },
        });
        if (!doesVetExist)
            return res.status(404).json(`Vet with id:${vet_id} does not exist`);
        if (!doesVetExist.is_approved)
            return res.status(400).json("Vet is not approved yet");
        const oldAppointment = yield prisma.appointment.findUnique({
            where: {
                id,
            },
        });
        if (!oldAppointment)
            return res.status(404).json("Appointment not found");
        if (!oldAppointment.vet_id == vet_id)
            return res.status(401).json("Unauthorized");
        const dateValue = new Date(date);
        const day = dateValue.getDay();
        const weekDay = helps_1.weekDays[day];
        const vetCalender = yield prisma.calendar.findUnique({
            where: {
                owner_id: vet_id,
            },
        });
        if (!JSON.parse(vetCalender[weekDay]))
            return res.status(400).json("Vet is not available on this day");
        if (parseInt(time.split(":")[1]) % 30 != 0) {
            return res.status(400).json("Time must be in increments of 30 minutes");
        }
        const weekDayWorkingHours = JSON.parse(vetCalender[weekDay]);
        if (weekDayWorkingHours === "closed")
            return res.status(400).json("Vet is not available on this day");
        const isBetweenWorkingHours = (0, moment_1.default)(`${date}  ${time}`).isBetween(`${date}  ${weekDayWorkingHours.morning.start_at}`, `${date}  ${weekDayWorkingHours.morning.end_at}`) ||
            (0, moment_1.default)(`${date}  ${time}`).isBetween(`${date}  ${weekDayWorkingHours.afternoon.start_at}`, `${date}  ${weekDayWorkingHours.afternoon.end_at}`);
        if (!isBetweenWorkingHours)
            return res.status(400).json("Vet is not available at this time");
        const newAppointment = yield prisma.appointment.update({
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
            to: doesUserExist.email,
            from: "info@tonveto.com",
            subject: "VetoLib Appointment Update",
            html: `<div><strong>Dear ${doesUserExist.first_name} ${doesUserExist.last_name}</strong> <span> Has booked an appointment with Doctor ${doesVetExist.first_name} ${doesVetExist.last_name} on ${date} ${time} for pet: ${doesPetExist.name}</span></div>
    `,
        };
        mail_1.default
            .send(msg)
            .then(() => {
            console.log("Email sent");
        })
            .catch((error) => {
            console.error(error);
        });
        res.status(200).json(newAppointment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.updateAppointmentVet = updateAppointmentVet;
const cancelAppointmentVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "")
            return res.status(400).json("Missing id");
        const { vet_id } = req.headers;
        if (vet_id == undefined)
            return res.status(400).json("Missing user_id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != vet_id)
            return res.status(401).json("Unauthorized");
        const doesUserExist = yield prisma.vet.findUnique({
            where: {
                id: vet_id,
            },
        });
        if (!doesUserExist)
            return res.status(404).json("Vet not found");
        const doesAppointmentExist = yield prisma.appointment.findUnique({
            where: {
                id,
            },
        });
        if (!doesAppointmentExist)
            return res.status(404).json("Appointment not found");
        const dayDifferece = (0, moment_1.default)(`${doesAppointmentExist.date} ${doesAppointmentExist.time}`).diff((0, moment_1.default)(), "minutes");
        if (dayDifferece < 0)
            return res.status(400).json("Cannot schedule past dates");
        const payment = yield prisma.pendingPayment.findFirst({
            where: {
                appointment_id: id,
            },
        });
        if (payment) {
            yield stripe.refunds.create({
                payment_intent: payment.payment_id,
            });
            yield prisma.pendingPayment.delete({
                where: {
                    id: payment.id,
                },
            });
        }
        const appointment = yield prisma.appointment.delete({
            where: {
                id,
            },
        });
        if (!appointment)
            return res.status(404).json("Appointment not found");
        const msg = {
            to: doesUserExist.email,
            from: "info@tonveto.com",
            subject: "VetoLib Appointment Cancelled",
            html: `<div><strong>Dear ${doesUserExist.first_name} ${doesUserExist.last_name}</strong> <span> Has canceled an appointment with id ${appointment.id} successfully </span></div>
    `,
        };
        res.status(200).json("Appointment canceled successfully");
    }
    catch (e) {
        console.log(e);
    }
});
exports.cancelAppointmentVet = cancelAppointmentVet;
const getAvailableAppointments = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json("Missing fields");
        const { logged_in_id, date } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        if (!date)
            return res.status(400).json("Missing date");
        if (!(0, moment_1.default)(date).isValid())
            return res.status(400).json("Invalid date");
        if ((0, moment_1.default)(date).diff((0, moment_1.default)(), "days") < 0)
            return res.status(400).json("Cannot schedule past dates");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id) {
            return res.status(401).json("Unauthorized");
        }
        const vetProfile = yield prisma.vet.findUnique({
            where: {
                id,
            },
            include: {
                appointments: {
                    where: {
                        date: date,
                    },
                },
                calendar: true,
            },
        });
        const dateValue = new Date(date);
        const day = dateValue.getDay();
        console.log("day", day);
        console.log("Week day", helps_1.weekDays[day]);
        const weekDay = helps_1.weekDays[day];
        if (!vetProfile)
            return res.status(404).json("Vet does not exist");
        if (!JSON.parse(vetProfile.calendar[0]["thursday"]))
            return res.status(400).json("Vet is not available on this day");
        const weekDayWorkingHours = JSON.parse(vetProfile.calendar[0][weekDay]);
        if (weekDayWorkingHours === "closed")
            return res.status(400).json("Vet is not available on this day");
        const morningHours = eachHalfHour(weekDayWorkingHours.morning.start_at, weekDayWorkingHours.morning.end_at);
        const afternoonHours = eachHalfHour(weekDayWorkingHours.afternoon.start_at, weekDayWorkingHours.afternoon.end_at);
        const dayHours = [...morningHours, ...afternoonHours];
        let availableHours = [];
        dayHours.forEach((hour) => {
            const isHourAvailable = vetProfile.appointments.every((appointment) => appointment.time !== hour);
            if (isHourAvailable)
                availableHours.push(hour);
        });
        return res.status(200).json(availableHours);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
});
exports.getAvailableAppointments = getAvailableAppointments;
var toInt = (time) => ((h, m) => h * 2 + m / 30)(...time.split(":").map(parseFloat)), toTime = (int) => [Math.floor(int / 2), int % 2 ? "30" : "00"].join(":"), range = (from, to) => Array(to - from + 1)
    .fill(0)
    .map((_, i) => from + i), eachHalfHour = (t1, t2) => range(...[t1, t2].map(toInt)).map(toTime);
//# sourceMappingURL=appointment.js.map