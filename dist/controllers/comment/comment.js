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
exports.deleteCommentClinic = exports.editCommentClinic = exports.addCommentClinic = exports.deleteCommentVet = exports.editCommentVet = exports.addCommentVet = void 0;
const authentication_1 = require("../authentication/authentication");
const addCommentVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text, logged_in_id, vet_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
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
        const comment = yield prisma.commentVet.create({
            data: {
                text,
                vet_id,
                owner_id: logged_in_id,
            },
        });
        res.status(200).json(comment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.addCommentVet = addCommentVet;
const editCommentVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { text, logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const user = yield prisma.user.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!user)
            return res.status(404).json("User not found");
        const doesCommentExist = yield prisma.commentVet.findUnique({
            where: {
                id: id,
            },
        });
        if (!doesCommentExist)
            return res.status(404).json("Comment not found");
        if (doesCommentExist.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const comment = yield prisma.commentVet.update({
            where: {
                id,
            },
            data: {
                text,
            },
        });
        res.status(200).json(comment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.editCommentVet = editCommentVet;
const deleteCommentVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const doesCommentExist = yield prisma.commentVet.findUnique({
            where: {
                id: id,
            },
        });
        if (!doesCommentExist)
            return res.status(404).json("Comment not found");
        if (doesCommentExist.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const comment = yield prisma.commentVet.delete({
            where: {
                id,
            },
        });
        res.status(200).json(comment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.deleteCommentVet = deleteCommentVet;
const addCommentClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text, logged_in_id, clinic_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const user = yield prisma.user.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!user)
            return res.status(404).json("User not found");
        const clinic = yield prisma.clinic.findUnique({
            where: {
                id: clinic_id,
            },
        });
        if (!clinic)
            return res.status(404).json("Vet not found");
        const comment = yield prisma.commentClinic.create({
            data: {
                text,
                clinic_id,
                owner_id: logged_in_id,
            },
        });
        res.status(200).json(comment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.addCommentClinic = addCommentClinic;
const editCommentClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { text, logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const user = yield prisma.user.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!user)
            return res.status(404).json("User not found");
        const doesCommentExist = yield prisma.commentClinic.findUnique({
            where: {
                id: id,
            },
        });
        if (!doesCommentExist)
            return res.status(404).json("Comment not found");
        if (doesCommentExist.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const comment = yield prisma.commentClinic.update({
            where: {
                id,
            },
            data: {
                text,
            },
        });
        res.status(200).json(comment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.editCommentClinic = editCommentClinic;
const deleteCommentClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const doesCommentExist = yield prisma.commentClinic.findUnique({
            where: {
                id: id,
            },
        });
        if (!doesCommentExist)
            return res.status(404).json("Comment not found");
        if (doesCommentExist.owner_id != logged_in_id)
            return res.status(401).json("Unauthorized");
        const comment = yield prisma.commentClinic.delete({
            where: {
                id,
            },
        });
        res.status(200).json(comment);
    }
    catch (e) {
        console.log(e);
    }
});
exports.deleteCommentClinic = deleteCommentClinic;
//# sourceMappingURL=comment.js.map