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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMedicalReport = exports.updateMedicalReport = exports.addMedicalReport = void 0;
const authentication_1 = require("../authentication/authentication");
const addMedicalReport = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { appointment_id, reason, diagnosis, treatment, notes, pet_id, vet_id, } = req.body;
        if (appointment_id == undefined ||
            reason == undefined ||
            diagnosis == undefined ||
            treatment == undefined ||
            notes == undefined ||
            pet_id == undefined ||
            vet_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != vet_id)
            return res.status(401).json("Unauthorized");
        const doesVetExist = yield prisma.vet.findUnique({
            where: {
                id: vet_id,
            },
        });
        if (!doesVetExist)
            return res.status(404).json("Vet does not exist");
        if (!doesVetExist.is_approved)
            return res.status(400).json("Vet is not approved yet");
        const doesPetExist = yield prisma.pet.findUnique({
            where: {
                id: pet_id,
            },
        });
        if (!doesPetExist)
            return res.status(404).json("Pet does not exist");
        const doesAppointmentExist = yield prisma.appointment.findUnique({
            where: {
                id: appointment_id,
            },
        });
        if (!doesAppointmentExist)
            return res.status(404).json("Appointment does not exist");
        const payment = yield prisma.pendingPayment.findFirst({
            where: {
                appointment_id: appointment_id,
            },
        });
        if (payment) {
            yield prisma.vet.update({
                where: {
                    id: vet_id,
                },
                data: {
                    balance: {
                        increment: payment.amount - 2,
                    },
                },
            });
            yield prisma.pendingPayment.delete({
                where: {
                    id: payment.id,
                },
            });
        }
        const medicalReport = yield prisma.medicalReport.create({
            data: {
                appointment_id,
                reason,
                diagnosis,
                treatment,
                notes,
                pet_id,
                vet_id,
            },
        });
        res.status(200).json(medicalReport);
    }
    catch (e) {
        console.log(e);
    }
});
exports.addMedicalReport = addMedicalReport;
const updateMedicalReport = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "")
            return res.status(400).json("Missing fields");
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const { appointment_id, reason, diagnosis, treatment, notes, pet_id } = req.body;
        if (appointment_id == undefined ||
            reason == undefined ||
            diagnosis == undefined ||
            treatment == undefined ||
            notes == undefined ||
            pet_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const doesMedicalReportExist = yield prisma.medicalReport.findUnique({
            where: {
                id,
            },
        });
        if (!doesMedicalReportExist)
            return res.status(404).json("Medical report does not exist");
        if (doesMedicalReportExist.vet_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const medicalReport = yield prisma.medicalReport.update({
            where: {
                id,
            },
            data: {
                appointment_id,
                reason,
                diagnosis,
                treatment,
                notes,
                pet_id,
            },
        });
        res.status(200).json(medicalReport);
    }
    catch (e) {
        console.log(e);
    }
});
exports.updateMedicalReport = updateMedicalReport;
const getMedicalReport = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "")
            return res.status(400).json("Missing fields");
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const medicalReport = yield prisma.medicalReport.findUnique({
            where: {
                id,
            },
            include: {
                pet: true,
                vet: true,
                appointment: true,
            },
        });
        if (!medicalReport)
            return res.status(404).json("Medical Report not found");
        res.status(200).json(medicalReport);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getMedicalReport = getMedicalReport;
//# sourceMappingURL=medicalReport.js.map