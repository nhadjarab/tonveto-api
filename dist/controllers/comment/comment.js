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
exports.reportClinicComment = exports.reportVetComment = exports.deleteCommentClinic = exports.editCommentClinic = exports.addCommentClinic = exports.deleteCommentVet = exports.editCommentVet = exports.addCommentVet = void 0;
const authentication_1 = require("../authentication/authentication");
const addCommentVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const { text, vet_id, rating } = req.body;
        if (text == undefined || vet_id == undefined || rating == undefined)
            return res.status(400).json("Missing fields");
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
        const ratingObject = yield prisma.ratingVet.create({
            data: {
                rating: parseFloat(rating),
                vet_id: vet_id,
                owner_id: logged_in_id,
            },
        });
        const comment = yield prisma.commentVet.create({
            data: {
                text,
                vet_id,
                owner_id: logged_in_id,
                rating_id: ratingObject.id,
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
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        if (!id || id === "")
            return res.status(400).json("Missing fields");
        const { text, rating } = req.body;
        if (text == undefined || rating == undefined)
            return res.status(400).json("Missing fields");
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
        const ratingObject = yield prisma.ratingVet.update({
            where: {
                id: doesCommentExist.rating_id,
            },
            data: {
                rating: parseFloat(rating),
            },
        });
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
        if (!id || id === "")
            return res.status(400).json("Missing fields");
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
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
        const rating = yield prisma.ratingVet.delete({
            where: {
                id: doesCommentExist.rating_id,
            },
        });
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
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const { text, clinic_id, rating } = req.body;
        if (text == undefined || clinic_id == undefined || rating == undefined)
            return res.status(400).json("Missing fields");
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
        const ratingObject = yield prisma.ratingClinic.create({
            data: {
                rating: parseFloat(rating),
                clinic_id: clinic_id,
                owner_id: logged_in_id,
            },
        });
        const comment = yield prisma.commentClinic.create({
            data: {
                text,
                clinic_id,
                owner_id: logged_in_id,
                rating_id: ratingObject.id,
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
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        if (!id || id === "")
            return res.status(400).json("Missing fields");
        const { text, rating } = req.body;
        if (text == undefined || rating == undefined)
            return res.status(400).json("Missing fields");
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
        const ratingObject = yield prisma.ratingClinic.update({
            where: {
                id: comment.rating_id,
            },
            data: {
                rating: parseFloat(rating),
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
        if (!id || id === "")
            return res.status(400).json("Missing fields");
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
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
        const rating = yield prisma.ratingClinic.delete({
            where: {
                id: doesCommentExist.rating_id,
            },
        });
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
const reportVetComment = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "")
            return res.status(400).json("Missing fields");
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const { user_type, vet_id } = req.body;
        if (user_type == undefined || vet_id == undefined)
            return res.status(400).json("Missing fields");
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
        let user;
        if (user_type === "user") {
            user = yield prisma.user.findUnique({
                where: {
                    id: logged_in_id,
                },
            });
        }
        else if (user_type === "vet") {
            user = yield prisma.vet.findUnique({
                where: {
                    id: logged_in_id,
                },
            });
        }
        else {
            return res.status(400).json("Invalid user type");
        }
        if (!user)
            return res.status(404).json("User not found");
        const vet = yield prisma.vet.findUnique({
            where: {
                id: vet_id,
            },
        });
        if (!vet)
            return res.status(404).json("Vet not found");
        const report = yield prisma.commentVetReport.create({
            data: {
                reported_by: logged_in_id,
                comment_id: id,
                reporter_type: user_type,
                vet_id,
            },
        });
        res.status(200).json(report);
    }
    catch (e) {
        console.log(e);
    }
});
exports.reportVetComment = reportVetComment;
const reportClinicComment = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "")
            return res.status(400).json("Missing fields");
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const { user_type, clinic_id } = req.body;
        if (user_type == undefined || clinic_id == undefined)
            return res.status(400).json("Missing fields");
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
        let user;
        if (user_type === "user") {
            user = yield prisma.user.findUnique({
                where: {
                    id: logged_in_id,
                },
            });
        }
        else if (user_type === "vet") {
            user = yield prisma.vet.findUnique({
                where: {
                    id: logged_in_id,
                },
            });
        }
        else {
            return res.status(400).json("Invalid user type");
        }
        if (!user)
            return res.status(404).json("User not found");
        const clinic = yield prisma.clinic.findUnique({
            where: {
                id: clinic_id,
            },
        });
        if (!clinic)
            return res.status(404).json("Clinic not found");
        const report = yield prisma.commentClinicReport.create({
            data: {
                reported_by: logged_in_id,
                comment_id: id,
                reporter_type: user_type,
                clinic_id,
            },
        });
        res.status(200).json(report);
    }
    catch (e) {
        console.log(e);
    }
});
exports.reportClinicComment = reportClinicComment;
//# sourceMappingURL=comment.js.map