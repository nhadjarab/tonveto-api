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
exports.cancelAppointments = exports.getAppointment = exports.updateAppointment = exports.addAppointment = void 0;
const authentication_1 = require("../authentication/authentication");
const addAppointment = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, time, pet_id, vet_id, user_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != user_id)
            return res.status(401).json("Unauthorized");
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
        const newAppointment = yield prisma.appointment.create({
            data: {
                date,
                time,
                pet_id,
                vet_id,
                user_id,
            },
        });
        res.status(200).json(newAppointment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.addAppointment = addAppointment;
const updateAppointment = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { date, time, pet_id, vet_id, user_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != user_id)
            return res.status(401).json("Unauthorized");
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
        const updatedAppointment = yield prisma.appointment.update({
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
        res.status(200).json(updatedAppointment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.updateAppointment = updateAppointment;
const getAppointment = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { logged_in_id } = req.body;
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
        const { user_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != user_id)
            return res.status(401).json("Unauthorized");
        const appointment = yield prisma.appointment.delete({
            where: {
                id,
            },
        });
        if (!appointment)
            return res.status(404).json("Appointment not found");
        res.status(200).json("Appointment canceled successfully");
    }
    catch (e) {
        console.log(e);
    }
});
exports.cancelAppointments = cancelAppointments;
//# sourceMappingURL=appointment.js.map