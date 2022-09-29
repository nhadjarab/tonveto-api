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
exports.getUser = exports.updateUser = void 0;
const authentication_1 = require("../authentication/authentication");
const updateUser = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json("Missing fields");
        const { first_name, last_name, email, birth_date, phone_number, is_subscribed, } = req.body;
        if (first_name == undefined ||
            last_name == undefined ||
            email == undefined ||
            birth_date == undefined ||
            phone_number == undefined ||
            is_subscribed == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != id)
            return res.status(401).json("Unauthorized");
        const oldUser = yield prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!oldUser)
            return res.status(404).json("User does not exist");
        if (oldUser.email != email) {
            const doesAuthExist = yield prisma.auth.findUnique({
                where: {
                    email,
                },
            });
            if (doesAuthExist)
                return res.status(400).json("Email already being used");
            const newAuth = yield prisma.auth.update({
                where: {
                    email: oldUser.email,
                },
                data: {
                    email,
                },
            });
        }
        const userProfile = yield prisma.user.update({
            where: {
                id,
            },
            data: {
                first_name,
                last_name,
                email,
                birth_date,
                phone_number,
                is_subscribed,
                profile_complete: isProfileComplete(first_name, last_name, email, birth_date, phone_number),
            },
        });
        res.status(200).json(userProfile);
    }
    catch (e) {
        res.status(500).json(e);
    }
});
exports.updateUser = updateUser;
const getUser = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
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
        const userProfile = yield prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                pets: true,
                appointments: {
                    include: {
                        vet: true,
                        pet: true,
                        clinic: true,
                        MedicalReport: true,
                    },
                },
            },
        });
        res.status(200).json(userProfile);
    }
    catch (e) {
        res.status(500).json(e);
    }
});
exports.getUser = getUser;
const isProfileComplete = (first_name, last_name, email, birth_date, phone_number) => {
    return (first_name != undefined &&
        last_name != undefined &&
        email != undefined &&
        birth_date != undefined &&
        phone_number != undefined &&
        first_name != "" &&
        last_name != "" &&
        email != "" &&
        birth_date != "" &&
        phone_number != "");
};
//# sourceMappingURL=user.js.map