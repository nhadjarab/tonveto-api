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
const dotenv_1 = __importDefault(require("dotenv"));
// Methods import
const authentication_1 = require("./controllers/authentication/authentication");
const user_1 = require("./controllers/user/user");
const pet_1 = require("./controllers/pet/pet");
const appointment_1 = require("./controllers/appointment/appointment");
const vet_1 = require("./controllers/vet/vet");
const clinic_1 = require("./controllers/clinic/clinic");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
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
app.put("/vet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, vet_1.updateVet)(req, res, prisma);
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
app.delete("/clinic/vet/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, clinic_1.removeVetFromClinic)(req, res, prisma);
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
app.get("/appointment/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, appointment_1.getAppointment)(req, res, prisma);
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
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
//# sourceMappingURL=index.js.map