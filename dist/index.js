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
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT;
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
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, authentication_1.login)(req, res, prisma);
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
// ===========USER ROUTES============
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
app.listen(port || 3005, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port || 3005}`);
});
//# sourceMappingURL=index.js.map