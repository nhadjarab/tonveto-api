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
exports.addPayment = void 0;
const authentication_1 = require("../authentication/authentication");
const validator_1 = __importDefault(require("validator"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey(process.env.SENDGRID);
const addPayment = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, vet_id, user_id, appointment_id, payment_id } = req.body;
        if (amount == undefined ||
            vet_id == undefined ||
            user_id == undefined ||
            appointment_id == undefined ||
            payment_id == undefined)
            return res.status(400).json("Missing fields");
        if (!validator_1.default.isNumeric(amount))
            return res.status(400).json("Invalid amount");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != user_id)
            return res.status(401).json("Unauthorized");
        const doesUserExist = yield prisma.user.findUnique({
            where: {
                id: user_id,
            },
        });
        if (!doesUserExist)
            return res.status(404).json("Pet owner does not exist");
        const doesVetExist = yield prisma.vet.findUnique({
            where: {
                id: vet_id,
            },
        });
        if (!doesVetExist)
            return res.status(404).json("Vet does not exist");
        const doesAppointmentExist = yield prisma.appointment.findUnique({
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
        const isAlreadyPaid = yield prisma.pendingPayment.findFirst({
            where: {
                appointment_id: appointment_id,
            },
        });
        if (isAlreadyPaid)
            return res.status(400).json("Appointment already paid");
        const newPayment = yield prisma.pendingPayment.create({
            data: {
                amount: parseFloat(amount),
                vet_id,
                user_id,
                appointment_id,
                payment_id,
            },
        });
        const msg = {
            to: doesUserExist.email,
            from: "info@tonveto.com",
            subject: "VetoLib Appointment",
            html: `<div><strong>Dear ${doesUserExist.first_name} ${doesUserExist.last_name}</strong> <span> Has booked an appointment with Doctor ${doesVetExist.first_name} ${doesVetExist.last_name} on ${doesAppointmentExist.date} ${doesAppointmentExist.time} for pet: ${doesAppointmentExist.pet.name}, in ${doesAppointmentExist.clinic.name} clinic</span></div>
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
        res.status(200).json(newPayment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.addPayment = addPayment;
//# sourceMappingURL=billing.js.map