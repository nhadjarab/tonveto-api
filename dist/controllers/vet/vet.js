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
exports.isVetInClinic = exports.joinClinic = exports.getVet = exports.updateVet = void 0;
const authentication_1 = require("../authentication/authentication");
const updateVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json("Missing fields");
        const { email, birth_date, first_name, last_name, phone_number, bank_details, identification_order, } = req.body;
        if (email == undefined ||
            birth_date == undefined ||
            first_name == undefined ||
            last_name == undefined ||
            phone_number == undefined ||
            bank_details == undefined ||
            identification_order == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != id)
            return res.status(401).json("Unauthorized");
        const oldVet = yield prisma.vet.findUnique({
            where: {
                id,
            },
        });
        if (!oldVet)
            return res.status(404).json("Vet does not exist");
        if (oldVet.email != email) {
            const doesAuthExist = yield prisma.auth.findUnique({
                where: {
                    email,
                },
            });
            if (doesAuthExist)
                return res.status(400).json("Email already being used");
            const newAuth = yield prisma.auth.update({
                where: {
                    email: oldVet.email,
                },
                data: {
                    email,
                },
            });
        }
        const doesVetWithIdentificationOrderExist = yield prisma.vet.findFirst({
            where: {
                identification_order,
            },
        });
        if (doesVetWithIdentificationOrderExist &&
            doesVetWithIdentificationOrderExist.id != id)
            return res
                .status(400)
                .json("A vet with identification order already exists");
        const vetProfile = yield prisma.vet.update({
            where: {
                id,
            },
            data: {
                first_name,
                last_name,
                email,
                birth_date,
                phone_number,
                bank_details,
                identification_order,
                profile_complete: isProfileComplete(first_name, last_name, email, birth_date, phone_number, bank_details, identification_order),
            },
        });
        res.status(200).json(vetProfile);
    }
    catch (e) {
        res.status(500).json(e);
    }
});
exports.updateVet = updateVet;
const getVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json("Missing fields");
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id) {
            return res.status(401).json("Unauthorized");
        }
        const vetProfile = yield prisma.vet.findUnique({
            where: {
                id,
            },
            include: {
                RatingVet: {},
                specialities: true,
                appointments: {
                    include: {
                        pet: true,
                        user: true,
                        MedicalReport: true,
                    },
                },
                calendar: true,
                CommentVet: {
                    include: {
                        owner: true,
                        rating: true,
                    },
                },
                clinics: {
                    include: { clinic: true },
                    where: {
                        approved: true,
                    },
                },
            },
        });
        if (!vetProfile)
            return res.status(404).json("Vet does not exist");
        const vetRating = yield prisma.ratingVet.aggregate({
            where: {
                vet_id: id,
            },
            _avg: {
                rating: true,
            },
        });
        res.status(200).json({ vetProfile, vetRating });
    }
    catch (e) {
        res.status(500).json(e);
    }
});
exports.getVet = getVet;
const joinClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json("Missing fields");
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id) {
            return res.status(401).json("Unauthorized");
        }
        const vetProfile = yield prisma.vet.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!vetProfile)
            return res.status(404).json("Vet does not exist");
        const isVetPartOfClinic = yield prisma.vetClinic.findUnique({
            where: {
                vet_id_clinic_id: {
                    vet_id: logged_in_id,
                    clinic_id: id,
                },
            },
        });
        if (isVetPartOfClinic)
            return res.status(400).json("Vet is already part of this clinic");
        const vetClinic = yield prisma.vetClinic.create({
            data: {
                vet_id: logged_in_id,
                clinic_id: id,
            },
        });
        return res.status(200).json(vetClinic);
    }
    catch (e) {
        res.status(500).json(e);
    }
});
exports.joinClinic = joinClinic;
const isVetInClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json("Missing fields");
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id) {
            return res.status(401).json("Unauthorized");
        }
        const vetProfile = yield prisma.vet.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!vetProfile)
            return res.status(404).json("Vet does not exist");
        const isVetPartOfClinic = yield prisma.vetClinic.findMany({
            where: {
                vet_id: id,
            },
        });
        return res.status(200).json(isVetPartOfClinic);
    }
    catch (e) {
        res.status(500).json(e);
    }
});
exports.isVetInClinic = isVetInClinic;
const isProfileComplete = (first_name, last_name, email, birth_date, phone_number, bank_details, identification_order) => {
    return (first_name != undefined &&
        last_name != undefined &&
        email != undefined &&
        birth_date != undefined &&
        phone_number != undefined &&
        bank_details != undefined &&
        identification_order != undefined &&
        first_name != "" &&
        last_name != "" &&
        email != "" &&
        birth_date != "" &&
        phone_number != "" &&
        bank_details != "" &&
        identification_order != "" &&
        identification_order != "1111111111");
};
//# sourceMappingURL=vet.js.map