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
exports.getVet = exports.updateVet = void 0;
const authentication_1 = require("../authentication/authentication");
const updateVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { email, birth_date, first_name, last_name, phone_number, bank_details, identification_order, profile_complete, } = req.body;
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
            const newAuth = yield prisma.auth.update({
                where: {
                    email: oldVet.email,
                },
                data: {
                    email,
                },
            });
        }
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
                profile_complete,
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
        const { logged_in_id } = req.headers;
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
                appointments: true,
                calendar: true,
                CommentVet: true,
                clinics: {
                    include: { clinic: true },
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
//# sourceMappingURL=vet.js.map