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
exports.getClinicApplicants = exports.rejectNewVet = exports.approveNewVet = exports.removeVetFromClinic = exports.addVetToClinic = exports.deleteClinic = exports.getClinic = exports.updateClinic = exports.createClinic = void 0;
const authentication_1 = require("../authentication/authentication");
const createClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, city, country, phone_number, owner_id } = req.body;
        if (name == undefined ||
            address == undefined ||
            city == undefined ||
            country == undefined ||
            phone_number == undefined ||
            owner_id == undefined) {
            return res.status(400).json("Missing fields");
        }
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
        if (!id || id === "")
            return res.status(400).json("Missing fields");
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const { name, address, city, country, phone_number, owner_id } = req.body;
        if (name == undefined ||
            address == undefined ||
            city == undefined ||
            country == undefined ||
            phone_number == undefined ||
            owner_id == undefined) {
            return res.status(400).json("Missing fields");
        }
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
        if (!isUserVet.is_approved)
            return res.status(400).json("Vet is not approved yet");
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
        if (!id || id === "")
            return res.status(400).json("Missing fields");
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const clinic = yield prisma.clinic.findUnique({
            where: {
                id,
            },
            include: {
                CommentClinic: true,
                vets: {
                    include: {
                        vet: true,
                    },
                    where: {
                        approved: true,
                    },
                },
                owner: true,
            },
        });
        if (!clinic)
            return res.status(404).json("Clinic does not exist");
        const clinicRating = yield prisma.ratingClinic.aggregate({
            where: {
                clinic_id: id,
            },
            _avg: {
                rating: true,
            },
        });
        res.status(200).json({ clinic, clinicRating });
    }
    catch (e) {
        console.log(e);
    }
});
exports.getClinic = getClinic;
const deleteClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
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
        const deleteComments = yield prisma.commentClinic.deleteMany({
            where: {
                clinic_id: id,
            },
        });
        const deleteReport = yield prisma.commentClinicReport.deleteMany({
            where: {
                clinic_id: id,
            },
        });
        const deleteRatings = yield prisma.ratingClinic.deleteMany({
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
        const { vet_id, clinic_id } = req.body;
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        if (vet_id == undefined || clinic_id == undefined)
            return res.status(400).json("Missing fields");
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
        if (!clinic.is_approved)
            return res.status(400).json("Clinic is not approved yet");
        if (clinic.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const vet = yield prisma.vet.findUnique({
            where: {
                id: vet_id,
            },
        });
        if (!vet)
            return res.status(404).json("Vet does not exist");
        if (!vet.is_approved)
            return res.status(400).json("Vet is not approved yet");
        const isVetAMember = yield prisma.vetClinic.findUnique({
            where: {
                vet_id_clinic_id: {
                    vet_id: vet_id,
                    clinic_id,
                },
            },
        });
        if (isVetAMember)
            return res.status(400).json("Vet is already a member of this clinic");
        const vetClinic = yield prisma.vetClinic.create({
            data: {
                vet_id,
                clinic_id,
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
        if (!id || id === "")
            return res.status(400).json("Missing fields");
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const { clinic_id } = req.body;
        if (clinic_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const clinic = yield prisma.clinic.findUnique({
            where: {
                id: clinic_id,
            },
            include: {
                vets: {
                    include: {
                        vet: true,
                    },
                    where: {
                        approved: true,
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
                id,
            },
        });
        if (!vet)
            return res.status(404).json("Vet does not exist");
        const vetClinic = yield prisma.vetClinic.delete({
            where: {
                vet_id_clinic_id: {
                    clinic_id,
                    vet_id: id,
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
const approveNewVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "")
            return res.status(400).json("Missing fields");
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const { clinic_id } = req.body;
        if (clinic_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const clinic = yield prisma.clinic.findUnique({
            where: {
                id: clinic_id,
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
        const vet = yield prisma.vet.findUnique({
            where: {
                id,
            },
        });
        if (!vet)
            return res.status(404).json("Vet does not exist");
        const vetClinicRelation = yield prisma.vetClinic.findUnique({
            where: {
                vet_id_clinic_id: {
                    vet_id: id,
                    clinic_id,
                },
            },
        });
        if (!vetClinicRelation)
            return res.status(404).json("Vet is not a member of this clinic");
        if (clinic.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const vetClinic = yield prisma.vetClinic.update({
            where: {
                vet_id_clinic_id: {
                    vet_id: id,
                    clinic_id,
                },
            },
            data: {
                approved: true,
            },
        });
        res.status(200).json(`Vet approved into clinic : ${clinic.name}`);
    }
    catch (e) {
        console.log(e);
    }
});
exports.approveNewVet = approveNewVet;
const rejectNewVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "")
            return res.status(400).json("Missing fields");
        const { logged_in_id, clinic_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        if (clinic_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const clinic = yield prisma.clinic.findUnique({
            where: {
                id: clinic_id,
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
        const vet = yield prisma.vet.findUnique({
            where: {
                id,
            },
        });
        if (!vet)
            return res.status(404).json("Vet does not exist");
        const vetClinicRelation = yield prisma.vetClinic.findUnique({
            where: {
                vet_id_clinic_id: {
                    vet_id: id,
                    clinic_id: clinic_id,
                },
            },
        });
        if (!vetClinicRelation)
            return res.status(404).json("Vet is not a member of this clinic");
        if (clinic.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const vetClinic = yield prisma.vetClinic.delete({
            where: {
                vet_id_clinic_id: {
                    vet_id: id,
                    clinic_id: clinic_id,
                },
            },
        });
        res.status(200).json(`Vet rejected from clinic : ${clinic.name}`);
    }
    catch (e) {
        console.log(e);
    }
});
exports.rejectNewVet = rejectNewVet;
const getClinicApplicants = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
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
        const clinic = yield prisma.clinic.findUnique({
            where: {
                id,
            },
        });
        if (!clinic)
            return res.status(404).json("Clinic does not exist");
        if (!clinic.is_approved)
            return res.status(400).json("Clinic is not approved yet");
        if (clinic.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const clinicApplicants = yield prisma.vetClinic.findMany({
            where: {
                clinic_id: id,
                approved: false,
            },
            include: {
                vet: true,
            },
        });
        res.status(200).json(clinicApplicants);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getClinicApplicants = getClinicApplicants;
//# sourceMappingURL=clinic.js.map