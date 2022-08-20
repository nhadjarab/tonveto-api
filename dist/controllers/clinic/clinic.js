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
exports.removeVetFromClinic = exports.addVetToClinic = exports.deleteClinic = exports.getClinic = exports.updateClinic = exports.createClinic = void 0;
const authentication_1 = require("../authentication/authentication");
const createClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, city, country, phone_number, owner_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != owner_id)
            return res.status(401).json("Unauthorized");
        const isUserVet = yield prisma.vet.findUnique({
            where: {
                id: owner_id,
            },
        });
        if (!isUserVet)
            return res.status(404).json("Vet does not exist");
        if (isUserVet.type != "vet")
            return res.status(401).json("Unauthorized");
        const newClinic = yield prisma.clinic.create({
            data: {
                name,
                address,
                city,
                country,
                phone_number,
                owner_id,
            },
        });
        const clinicVet = yield prisma.vetClinic.create({
            data: {
                clinic_id: newClinic.id,
                vet_id: owner_id,
                approved: true,
            },
        });
        res.status(200).json(newClinic);
    }
    catch (e) {
        console.log(e);
    }
});
exports.createClinic = createClinic;
const updateClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, address, city, country, phone_number, owner_id, logged_in_id, } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const isUserVet = yield prisma.vet.findUnique({
            where: {
                id: owner_id,
            },
        });
        if (!isUserVet)
            return res.status(404).json("Vet does not exist");
        if (isUserVet.type != "vet")
            return res.status(401).json("Unauthorized");
        const clinic = yield prisma.clinic.findUnique({
            where: {
                id,
            },
        });
        if (!clinic)
            return res.status(404).json("Clinic does not exist");
        if (clinic.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const newClinic = yield prisma.clinic.update({
            where: {
                id,
            },
            data: {
                name,
                address,
                city,
                country,
                phone_number,
                owner_id,
            },
        });
        res.status(200).json(newClinic);
    }
    catch (e) {
        console.log(e);
    }
});
exports.updateClinic = updateClinic;
const getClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const clinic = yield prisma.clinic.findUnique({
            where: {
                id,
            },
            include: {
                vets: {
                    include: {
                        vet: true,
                    },
                    where: {
                    // approved: true,
                    },
                },
                owner: true,
            },
        });
        if (!clinic)
            return res.status(404).json("Clinic does not exist");
        res.status(200).json(clinic);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getClinic = getClinic;
const deleteClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const clinic = yield prisma.clinic.findUnique({
            where: {
                id,
            },
        });
        if (!clinic)
            return res.status(404).json("Clinic does not exist");
        if (clinic.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const deleteRelation = yield prisma.vetClinic.deleteMany({
            where: {
                clinic_id: id,
            },
        });
        const deletedClinic = yield prisma.clinic.delete({
            where: { id },
        });
        res.status(200).json(deletedClinic);
    }
    catch (e) {
        console.log(e);
    }
});
exports.deleteClinic = deleteClinic;
const addVetToClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logged_in_id, vet_id, clinic_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const clinic = yield prisma.clinic.findUnique({
            where: {
                id: clinic_id,
            },
        });
        if (!clinic)
            return res.status(404).json("Clinic does not exist");
        if (clinic.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const vet = yield prisma.vet.findUnique({
            where: {
                id: vet_id,
            },
        });
        if (!vet)
            return res.status(404).json("Vet does not exist");
        const vetClinic = yield prisma.vetClinic.create({
            data: {
                vet_id: vet_id,
                clinic_id: clinic_id,
            },
        });
        res.status(200).json(`Vet added to clinic : ${clinic.name}`);
    }
    catch (e) {
        console.log(e);
    }
});
exports.addVetToClinic = addVetToClinic;
const removeVetFromClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { logged_in_id, vet_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const clinic = yield prisma.clinic.findUnique({
            where: {
                id,
            },
            include: {
                vets: {
                    include: {
                        vet: true,
                    },
                    where: {
                    // approved: true,
                    },
                },
                owner: true,
            },
        });
        if (!clinic)
            return res.status(404).json("Clinic does not exist");
        if (clinic.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const vet = yield prisma.vet.findUnique({
            where: {
                id: vet_id,
            },
        });
        if (!vet)
            return res.status(404).json("Vet does not exist");
        const vetClinic = yield prisma.vetClinic.delete({
            where: {
                vet_id_clinic_id: {
                    clinic_id: id,
                    vet_id: vet_id,
                },
            },
        });
        res.status(200).json(`Vet removed from clinic : ${clinic.name}`);
    }
    catch (e) {
        console.log(e);
    }
});
exports.removeVetFromClinic = removeVetFromClinic;
//# sourceMappingURL=clinic.js.map