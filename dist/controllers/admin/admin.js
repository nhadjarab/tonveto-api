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
exports.getAllClinicApplications = exports.getAllVetApplications = exports.rejectCommentReport = exports.approveCommentReport = exports.getCommentReports = exports.approveVet = exports.approveClinic = exports.getAllPayments = exports.getAllAppointments = exports.getAllClinics = exports.updateAdmin = exports.getAllVets = exports.getAllUsers = exports.getAdmin = void 0;
const authentication_1 = require("../authentication/authentication");
const getAdmin = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
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
        const adminProfile = yield prisma.admin.findUnique({
            where: {
                id,
            },
        });
        if (!adminProfile)
            return res.status(404).json("Vet does not exist");
        res.status(200).json(adminProfile);
    }
    catch (e) {
        res.status(500).json(e);
    }
});
exports.getAdmin = getAdmin;
const getAllUsers = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId !== logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const users = yield prisma.user.findMany({
            include: {
                appointments: true,
                pets: {
                    include: {
                        appointments: true,
                        MedicalReport: true,
                    },
                },
            },
        });
        res.status(200).json(users);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getAllUsers = getAllUsers;
const getAllVets = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId !== logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const vets = yield prisma.vet.findMany({
            include: {
                calendar: true,
                appointments: true,
                clinics: {
                    include: {
                        clinic: true,
                    },
                },
                MedicalReport: true,
                specialities: true,
                CommentVet: {
                    include: {
                        rating: true,
                    },
                },
            },
        });
        res.status(200).json(vets);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getAllVets = getAllVets;
const updateAdmin = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json("Missing fields");
        const { email, birth_date, first_name, last_name, phone_number } = req.body;
        if (email == undefined ||
            birth_date == undefined ||
            first_name == undefined ||
            last_name == undefined ||
            phone_number == undefined)
            return res.status(400).json("Missing fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != id)
            return res.status(401).json("Unauthorized");
        const oldAdmin = yield prisma.admin.findUnique({
            where: {
                id,
            },
        });
        if (!oldAdmin)
            return res.status(404).json("Admin does not exist");
        if (oldAdmin.email != email) {
            const doesAuthExist = yield prisma.auth.findUnique({
                where: {
                    email,
                },
            });
            if (doesAuthExist)
                return res.status(400).json("Email already being used");
            const newAuth = yield prisma.auth.update({
                where: {
                    email: oldAdmin.email,
                },
                data: {
                    email,
                },
            });
        }
        const adminProfile = yield prisma.admin.update({
            where: {
                id,
            },
            data: {
                first_name,
                last_name,
                email,
                birth_date,
                phone_number,
            },
        });
        res.status(200).json(adminProfile);
    }
    catch (e) {
        res.status(500).json(e);
    }
});
exports.updateAdmin = updateAdmin;
const getAllClinics = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId !== logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const clinics = yield prisma.clinic.findMany({
            include: {
                vets: {
                    include: {
                        vet: true,
                    },
                },
            },
        });
        res.status(200).json(clinics);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getAllClinics = getAllClinics;
const getAllAppointments = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId !== logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const appointments = yield prisma.appointment.findMany({
            include: {
                vet: true,
                pet: true,
                MedicalReport: true,
                user: true,
            },
        });
        res.status(200).json(appointments);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getAllAppointments = getAllAppointments;
const getAllPayments = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId !== logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const appointments = yield prisma.pendingPayment.findMany({
            include: {
                vet: true,
            },
        });
        res.status(200).json(appointments);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getAllPayments = getAllPayments;
const approveClinic = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "") {
            return res.status(400).json("Missing id");
        }
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId !== logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const clinic = yield prisma.clinic.findUnique({
            where: {
                id,
            },
        });
        if (!clinic)
            return res.status(404).json("Clinic not found");
        const updatedClinic = yield prisma.clinic.update({
            where: {
                id,
            },
            data: {
                is_approved: true,
            },
        });
        res.status(200).json(updatedClinic);
    }
    catch (e) {
        console.log(e);
    }
});
exports.approveClinic = approveClinic;
const approveVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "") {
            return res.status(400).json("Missing id");
        }
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId !== logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const vet = yield prisma.vet.findUnique({
            where: {
                id,
            },
        });
        if (!vet)
            return res.status(404).json("Clinic not found");
        const updatedVet = yield prisma.vet.update({
            where: {
                id,
            },
            data: {
                is_approved: true,
            },
        });
        res.status(200).json(updatedVet);
    }
    catch (e) {
        console.log(e);
    }
});
exports.approveVet = approveVet;
const getCommentReports = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId !== logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const vetCommentReports = yield prisma.commentVetReport.findMany({
            include: {
                comment: {
                    include: {
                        rating: true,
                    },
                },
            },
        });
        const clinicCommentReports = yield prisma.commentClinicReport.findMany({
            include: {
                comment: {
                    include: {
                        rating: true,
                    },
                },
            },
        });
        const totalReports = [...vetCommentReports, ...clinicCommentReports];
        res.status(200).json(totalReports);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getCommentReports = getCommentReports;
const approveCommentReport = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "") {
            return res.status(400).json("Missing id");
        }
        const { logged_in_id, comment_type, comment_id } = req.headers;
        console.log(req.headers);
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        if (comment_type == undefined || comment_id == undefined)
            return res.status(400).json("Missing comment fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId !== logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        let commentReport;
        if (comment_type === "vet") {
            const comment = yield prisma.commentVet.findUnique({
                where: {
                    id: comment_id,
                },
            });
            if (!comment)
                return res.status(404).json("Comment not found");
            commentReport = yield prisma.commentVetReport.delete({
                where: {
                    id,
                },
            });
            yield prisma.ratingVet.delete({
                where: {
                    id: comment.rating_id,
                },
            });
        }
        else if (comment_type === "clinic") {
            const comment = yield prisma.commentClinic.findUnique({
                where: {
                    id: comment_id,
                },
            });
            if (!comment)
                return res.status(404).json("Comment not found");
            commentReport = yield prisma.commentClinicReport.delete({
                where: {
                    id,
                },
            });
            yield prisma.ratingClinic.delete({
                where: {
                    id: comment.rating_id,
                },
            });
        }
        else {
            return res.status(400).json("Invalid comment type");
        }
        res.status(200).json(commentReport);
    }
    catch (e) {
        console.log(e);
    }
});
exports.approveCommentReport = approveCommentReport;
const rejectCommentReport = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || id === "") {
            return res.status(400).json("Missing id");
        }
        const { logged_in_id, comment_type, comment_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        if (comment_type == undefined || comment_id == undefined)
            return res.status(400).json("Missing comment fields");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId !== logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        let commentReport;
        if (comment_type === "vet") {
            const comment = yield prisma.commentVet.findUnique({
                where: {
                    id: comment_id,
                },
            });
            if (!comment)
                return res.status(404).json("Comment not found");
            commentReport = yield prisma.commentVetReport.delete({
                where: {
                    id,
                },
            });
        }
        else if (comment_type === "clinic") {
            const comment = yield prisma.commentClinic.findUnique({
                where: {
                    id: comment_id,
                },
            });
            if (!comment)
                return res.status(404).json("Comment not found");
            commentReport = yield prisma.commentClinicReport.delete({
                where: {
                    id,
                },
            });
        }
        else {
            return res.status(400).json("Invalid comment type");
        }
        res.status(200).json(commentReport);
    }
    catch (e) {
        console.log(e);
    }
});
exports.rejectCommentReport = rejectCommentReport;
const getAllVetApplications = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId !== logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const vets = yield prisma.vet.findMany({
            where: {
                is_approved: false,
            },
        });
        res.status(200).json(vets);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getAllVetApplications = getAllVetApplications;
const getAllClinicApplications = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logged_in_id } = req.headers;
        if (!logged_in_id)
            return res.status(400).json("Missing logged in id");
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId !== logged_in_id)
            return res.status(401).json("Unauthorized");
        const admin = yield prisma.admin.findUnique({
            where: {
                id: logged_in_id,
            },
        });
        if (!admin)
            return res.status(404).json("Admin not found");
        const clinics = yield prisma.clinic.findMany({
            include: {
                owner: true,
            },
            where: {
                is_approved: false,
            },
        });
        res.status(200).json(clinics);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getAllClinicApplications = getAllClinicApplications;
//# sourceMappingURL=admin.js.map