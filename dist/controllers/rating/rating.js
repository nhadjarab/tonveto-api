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
exports.deleteRatingClinic = exports.editRatingClinic = exports.addRatingClinic = exports.deleteRatingVet = exports.editRatingVet = exports.addRatingVet = void 0;
const authentication_1 = require("../authentication/authentication");
const addRatingVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rating, logged_in_id, vet_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        if (parseFloat(rating) > 5 || parseFloat(rating) < 0)
            return res.status(400).json("Rating must be between 0 and 5");
        const user = yield prisma.user.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!user)
            return res.status(404).json("User not found");
        const vet = yield prisma.vet.findUnique({
            where: {
                id: vet_id,
            },
        });
        if (!vet)
            return res.status(404).json("Vet not found");
        const ratingData = yield prisma.ratingVet.create({
            data: {
                rating: parseFloat(rating),
                vet_id,
                owner_id: logged_in_id,
            },
        });
        res.status(200).json(ratingData);
    }
    catch (e) {
        console.log(e);
    }
});
exports.addRatingVet = addRatingVet;
const editRatingVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { rating, logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        if (parseFloat(rating) > 5 || parseFloat(rating) < 0)
            return res.status(400).json("Rating must be between 0 and 5");
        const user = yield prisma.user.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!user)
            return res.status(404).json("User not found");
        const doesRatingExist = yield prisma.ratingVet.findUnique({
            where: {
                id: id,
            },
        });
        if (!doesRatingExist)
            return res.status(404).json("Rating not found");
        if (doesRatingExist.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const newRating = yield prisma.ratingVet.update({
            where: {
                id,
            },
            data: {
                rating: parseFloat(rating),
            },
        });
        res.status(200).json(newRating);
    }
    catch (e) {
        console.log(e);
    }
});
exports.editRatingVet = editRatingVet;
const deleteRatingVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const doesRatingExist = yield prisma.ratingVet.findUnique({
            where: {
                id: id,
            },
        });
        if (!doesRatingExist)
            return res.status(404).json("Rating not found");
        if (doesRatingExist.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const oldRating = yield prisma.ratingVet.delete({
            where: {
                id,
            },
        });
        res.status(200).json(oldRating);
    }
    catch (e) {
        console.log(e);
    }
});
exports.deleteRatingVet = deleteRatingVet;
const addRatingClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rating, logged_in_id, clinic_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        if (parseFloat(rating) > 5 || parseFloat(rating) < 0)
            return res.status(400).json("Rating must be between 0 and 5");
        const user = yield prisma.user.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!user)
            return res.status(404).json("User not found");
        const vet = yield prisma.clinic.findUnique({
            where: {
                id: clinic_id,
            },
        });
        if (!vet)
            return res.status(404).json("Vet not found");
        const ratingData = yield prisma.ratingClinic.create({
            data: {
                rating: parseFloat(rating),
                clinic_id,
                owner_id: logged_in_id,
            },
        });
        res.status(200).json(ratingData);
    }
    catch (e) {
        console.log(e);
    }
});
exports.addRatingClinic = addRatingClinic;
const editRatingClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { rating, logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        if (parseFloat(rating) > 5 || parseFloat(rating) < 0)
            return res.status(400).json("Rating must be between 0 and 5");
        const user = yield prisma.user.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!user)
            return res.status(404).json("User not found");
        const doesRatingExist = yield prisma.ratingClinic.findUnique({
            where: {
                id: id,
            },
        });
        if (!doesRatingExist)
            return res.status(404).json("Rating not found");
        if (doesRatingExist.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const newRating = yield prisma.ratingClinic.update({
            where: {
                id,
            },
            data: {
                rating: parseFloat(rating),
            },
        });
        res.status(200).json(newRating);
    }
    catch (e) {
        console.log(e);
    }
});
exports.editRatingClinic = editRatingClinic;
const deleteRatingClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const doesRatingExist = yield prisma.ratingClinic.findUnique({
            where: {
                id: id,
            },
        });
        if (!doesRatingExist)
            return res.status(404).json("Rating not found");
        if (doesRatingExist.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const oldRating = yield prisma.ratingClinic.delete({
            where: {
                id,
            },
        });
        res.status(200).json(oldRating);
    }
    catch (e) {
        console.log(e);
    }
});
exports.deleteRatingClinic = deleteRatingClinic;
//# sourceMappingURL=rating.js.map