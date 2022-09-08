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
exports.deletePet = exports.getPet = exports.updatePet = exports.addPet = void 0;
const authentication_1 = require("../authentication/authentication");
const addPet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sex, name, birth_date, species, breed, crossbreed, sterilised, owner_id, } = req.body;
        if (sex == undefined ||
            name == undefined ||
            birth_date == undefined ||
            species == undefined ||
            breed == undefined ||
            crossbreed == undefined ||
            sterilised == undefined ||
            owner_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != owner_id)
            return res.status(401).json("Unauthorized");
        const doesUserExist = yield prisma.user.findUnique({
            where: {
                id: owner_id,
            },
        });
        if (!doesUserExist)
            return res.status(404).json("Pet owner does not exist");
        const newPet = yield prisma.pet.create({
            data: {
                sex,
                name,
                birth_date,
                species,
                breed,
                crossbreed,
                sterilised,
                owner_id,
            },
        });
        res.status(200).json(newPet);
    }
    catch (e) {
        console.log(e);
    }
});
exports.addPet = addPet;
const updatePet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "")
            return res.status(400).json("Missing fields");
        const { sex, name, birth_date, species, breed, crossbreed, sterilised, owner_id, } = req.body;
        if (sex == undefined ||
            name == undefined ||
            birth_date == undefined ||
            species == undefined ||
            breed == undefined ||
            crossbreed == undefined ||
            sterilised == undefined ||
            owner_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != owner_id)
            return res.status(401).json("Unauthorized");
        const pet = yield prisma.pet.findUnique({
            where: {
                id,
            },
        });
        if (!pet)
            return res.status(404).json("Pet not found");
        const newPet = yield prisma.pet.update({
            where: {
                id,
            },
            data: {
                sex,
                name,
                birth_date,
                species,
                breed,
                crossbreed,
                sterilised,
                owner_id,
            },
        });
        if (!newPet)
            res.status(404).json("Pet not found");
        res.status(200).json(newPet);
    }
    catch (e) {
        console.log(e);
    }
});
exports.updatePet = updatePet;
const getPet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
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
        const pet = yield prisma.pet.findUnique({
            where: {
                id,
            },
            include: {
                appointments: {
                    include: {
                        vet: true,
                        MedicalReport: true,
                    },
                },
            },
        });
        if (!pet)
            return res.status(404).json("Pet not found");
        res.status(200).json(pet);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getPet = getPet;
const deletePet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "")
            return res.status(400).json("Missing fields");
        const { owner_id } = req.body;
        if (owner_id == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != owner_id)
            return res.status(401).json("Unauthorized");
        const pet = yield prisma.pet.findUnique({
            where: {
                id,
            },
        });
        if (!pet)
            return res.status(404).json("Pet not found");
        if (pet.owner_id != owner_id)
            return res.status(401).json("Unauthorized");
        const removedPet = yield prisma.pet.delete({
            where: {
                id,
            },
        });
        res.status(200).json("Pet deleted successfully");
    }
    catch (e) {
        console.log(e);
    }
});
exports.deletePet = deletePet;
//# sourceMappingURL=pet.js.map