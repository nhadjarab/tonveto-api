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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Methods import
const authentication_1 = require("./controllers/authentication/authentication");
const user_1 = require("./controllers/user/user");
const pet_1 = require("./controllers/pet/pet");
const appointment_1 = require("./controllers/appointment/appointment");
const vet_1 = require("./controllers/vet/vet");
const clinic_1 = require("./controllers/clinic/clinic");
const calendar_1 = require("./controllers/calendar/calendar");
const specialty_1 = require("./controllers/specialtiy/specialty");
const medicalReport_1 = require("./controllers/medical report/medicalReport");
const admin_1 = require("./controllers/admin/admin");
const comment_1 = require("./controllers/comment/comment");
const rating_1 = require("./controllers/rating/rating");
const search_1 = require("./controllers/search/search");
const billing_1 = require("./controllers/billing/billing");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const port = process.env.PORT || 3005;
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
// ===========AUTHENTICATION ROUTES============
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, authentication_1.register)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.post("/registerVet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, authentication_1.registerVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.post("/registerAdmin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, authentication_1.registerAdmin)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, authentication_1.login)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.post("/loginVet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, authentication_1.loginVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.post("/loginAdmin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, authentication_1.loginAdmin)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
// ===========USER ROUTES============
app.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, user_1.getUser)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, user_1.updateUser)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
// ===========Vet ROUTES============
app.get("/vet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, vet_1.getVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/vetClinics/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, vet_1.isVetInClinic)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/vet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, vet_1.updateVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.post("/joinClinic/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, vet_1.joinClinic)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
// ===========Clinic ROUTES============
app.post("/clinic", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, clinic_1.createClinic)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/clinic/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, clinic_1.updateClinic)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/clinic/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, clinic_1.getClinic)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/clinicApplications/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, clinic_1.getClinicApplicants)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.delete("/clinic/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, clinic_1.deleteClinic)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.post("/clinic/vet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, clinic_1.addVetToClinic)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/clinic/vet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, clinic_1.approveNewVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.delete("/clinic/vet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, clinic_1.removeVetFromClinic)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.delete("/clinic/vetApplication/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, clinic_1.rejectNewVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
// ===========Pet ROUTES============
app.post("/pet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, pet_1.addPet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/pet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, pet_1.updatePet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/pet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, pet_1.getPet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.delete("/pet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, pet_1.deletePet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
// ===========Appointment ROUTERS============
app.post("/appointment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, appointment_1.addAppointment)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/appointment/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, appointment_1.updateAppointment)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.post("/appointmentVet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, appointment_1.addAppointmentVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/appointmentVet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, appointment_1.updateAppointmentVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/appointment/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, appointment_1.getAppointment)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/vetAvailableAppointments/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, appointment_1.getAvailableAppointments)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.delete("/appointment/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, appointment_1.cancelAppointments)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.delete("/appointmentVet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, appointment_1.cancelAppointmentVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.post("/closeTimeSlot", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, appointment_1.closeTimeSlot)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.post("/openTimeSlot", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, appointment_1.openTimeSlot)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
// ===========Calendar ROUTERS============
app.post("/calendar", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, calendar_1.addCalendar)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/calendar/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, calendar_1.updateCalendar)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/calendar/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, calendar_1.getCalendar)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.delete("/calendar/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, calendar_1.deleteCalendar)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
// ===========Specialty ROUTERS============
app.post("/specialty", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, specialty_1.addSpecialty)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/specialty/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, specialty_1.updateSpecialty)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/specialty/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, specialty_1.getSpecialty)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.delete("/specialty/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, specialty_1.deleteSpecialty)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
// ===========Medical Report ROUTERS============
app.post("/report", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, medicalReport_1.addMedicalReport)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/report/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, medicalReport_1.updateMedicalReport)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/report/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, medicalReport_1.getMedicalReport)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
// ===========Comment ROUTERS============
app.post("/ratingVet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, rating_1.addRatingVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.post("/ratingClinic", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, rating_1.addRatingClinic)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/ratingVet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, rating_1.editRatingVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/ratingClinic/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, rating_1.editRatingClinic)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.delete("/ratingVet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, rating_1.deleteRatingVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.delete("/ratingClinic/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, rating_1.deleteRatingClinic)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
// ===========Comment ROUTERS============
app.post("/commentVet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, comment_1.addCommentVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.post("/commentClinic", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, comment_1.addCommentClinic)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.post("/reportCommentVet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, comment_1.reportVetComment)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.post("/reportCommentClinic/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, comment_1.reportClinicComment)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/commentVet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, comment_1.editCommentVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/commentClinic/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, comment_1.editCommentClinic)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.delete("/commentVet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, comment_1.deleteCommentVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.delete("/commentClinic/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, comment_1.deleteCommentClinic)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
// ===========Admin ROUTERS============
app.put("/admin/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, admin_1.updateAdmin)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/getAllUsers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, admin_1.getAllUsers)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/getAllVets", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, admin_1.getAllVets)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/getAllClinics", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, admin_1.getAllClinics)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/getAllAppointments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, admin_1.getAllAppointments)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/getAllPayments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, admin_1.getAllPayments)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/getAllCommentReports", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, admin_1.getCommentReports)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/getAllVetApplications", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, admin_1.getAllVetApplications)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/getAllClinicApplications", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, admin_1.getAllClinicApplications)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/approveClinic/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, admin_1.approveClinic)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.put("/approveVet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, admin_1.approveVet)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.delete("/approveCommentReport/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, admin_1.approveCommentReport)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.delete("/rejectCommentReport/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, admin_1.rejectCommentReport)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
// ===========Search ROUTERS============
app.get("/search/:query", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, search_1.search)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/advancedSearch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, search_1.advancedSearch)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
// ===========Payment ROUTERS============
app.post("/payment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, billing_1.addPayment)(req, res, prisma);
    }
    catch (e) {
        console.log(e);
    }
}));
// API ENDPOINTS
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
//# sourceMappingURL=index.js.map