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
exports.approveVet = exports.approveClinic = exports.getAllAppointments = exports.getAllClinics = exports.getAllVets = exports.getAllUsers = void 0;
const authentication_1 = require("../authentication/authentication");
const getAllUsers = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const users = yield prisma.user.findMany({
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
    }
    catch (e) {
        console.log(e);
    }
});
exports.getAllUsers = getAllUsers;
const getAllVets = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const vets = yield prisma.vet.findMany({
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
            },
        });
        res.status(200).json(vets);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getAllVets = getAllVets;
const getAllClinics = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const clinics = yield prisma.clinic.findMany({
            include: {
                vets: {
                    include: {
                        vet: true,
                    },
                },
            },
        });
        res.status(200).json(clinics);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getAllClinics = getAllClinics;
const getAllAppointments = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const appointments = yield prisma.appointment.findMany({
            include: {
                vet: true,
                pet: true,
                MedicalReport: true,
                user: true,
            },
        });
        res.status(200).json(appointments);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getAllAppointments = getAllAppointments;
const approveClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const clinic = yield prisma.clinic.findUnique({
            where: {
                id,
            },
        });
        if (!clinic)
            return res.status(404).json("Clinic not found");
        const updatedClinic = yield prisma.clinic.update({
            where: {
                id,
            },
            data: {
                is_approved: true,
            },
        });
        res.status(200).json(updatedClinic);
    }
    catch (e) {
        console.log(e);
    }
});
exports.approveClinic = approveClinic;
const approveVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const vet = yield prisma.vet.findUnique({
            where: {
                id,
            },
        });
        if (!vet)
            return res.status(404).json("Clinic not found");
        const updatedVet = yield prisma.vet.update({
            where: {
                id,
            },
            data: {
                is_approved: true,
            },
        });
        res.status(200).json(updatedVet);
    }
    catch (e) {
        console.log(e);
    }
});
exports.approveVet = approveVet;
//# sourceMappingURL=admin.js.map