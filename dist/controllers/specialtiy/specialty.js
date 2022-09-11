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
exports.deleteSpecialty = exports.getSpecialty = exports.updateSpecialty = exports.addSpecialty = void 0;
const authentication_1 = require("../authentication/authentication");
const addSpecialty = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, owner_id } = req.body;
        if (name == undefined || price == undefined || owner_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != owner_id)
            return res.status(401).json("Unauthorized");
        const doesUserExist = yield prisma.vet.findUnique({
            where: {
                id: owner_id,
            },
        });
        if (!doesUserExist)
            return res.status(404).json("Vet does not exist");
        if (!doesUserExist.is_approved)
            return res.status(400).json("Vet is not approved yet");
        const newSpecialty = yield prisma.specialty.create({
            data: {
                name,
                price,
                vet_id: owner_id,
            },
        });
        res.status(200).json(newSpecialty);
    }
    catch (e) {
        console.log(e);
    }
});
exports.addSpecialty = addSpecialty;
const updateSpecialty = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json("Missing fields");
        const { name, price, owner_id } = req.body;
        if (name == undefined || price == undefined || owner_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != owner_id)
            return res.status(401).json("Unauthorized");
        const specialty = yield prisma.specialty.findUnique({
            where: {
                id,
            },
        });
        if (!specialty)
            return res.status(404).json("Specialty does not exist");
        const newSpecialty = yield prisma.specialty.update({
            where: {
                id,
            },
            data: {
                name,
                price,
            },
        });
        res.status(200).json(newSpecialty);
    }
    catch (e) {
        console.log(e);
    }
});
exports.updateSpecialty = updateSpecialty;
const getSpecialty = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json("Missing fields");
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const specialty = yield prisma.specialty.findUnique({
            where: {
                id,
            },
            include: {
                vet: true,
            },
        });
        if (!specialty)
            return res.status(404).json("Specialty not found");
        res.status(200).json(specialty);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getSpecialty = getSpecialty;
const deleteSpecialty = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json("Missing fields");
        const { owner_id } = req.headers;
        if (owner_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != owner_id)
            return res.status(401).json("Unauthorized");
        const specialty = yield prisma.specialty.findUnique({
            where: {
                id,
            },
        });
        if (!specialty)
            return res.status(404).json("Specialty not found");
        if (specialty.vet_id != owner_id)
            return res.status(401).json("Unauthorized");
        const removedSpecialty = yield prisma.specialty.delete({
            where: {
                id,
            },
        });
        res.status(200).json("Specialty deleted successfully");
    }
    catch (e) {
        console.log(e);
    }
});
exports.deleteSpecialty = deleteSpecialty;
//# sourceMappingURL=specialty.js.map