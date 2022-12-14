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
exports.handleTokenVerification = exports.verifyToken = exports.generateToken = exports.loginAdmin = exports.loginVet = exports.login = exports.registerAdmin = exports.registerVet = exports.register = void 0;
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const private_key = fs_1.default.readFileSync(__dirname + "/vetolib.rsa");
const public_key = fs_1.default.readFileSync(__dirname + "/vetolib.rsa.pub");
const register = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // return 400 if email or password is missing
    if (email == undefined || password == undefined) {
        return res.status(400).json("Email and password are required");
    }
    const existingAccount = yield prisma.auth.findUnique({
        where: {
            email,
        },
    });
    if (existingAccount)
        return res.status(400).json("Account already exists");
    const hash = bcrypt_1.default.hashSync(password, 10);
    prisma.auth
        .create({
        data: {
            email,
            passwordHash: hash,
        },
    })
        .then(() => {
        prisma.user
            .create({
            data: {
                email,
                birth_date: new Date().toString(),
                first_name: "",
                last_name: "",
                phone_number: "",
            },
        })
            .finally(() => {
            res.status(200).json("User created");
        })
            .catch((err) => {
            res.status(500).json(err);
        });
    })
        .catch((e) => {
        res.status(500).json("User not created");
    });
});
exports.register = register;
const registerVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // return 400 if email or password is missing
        if (email == undefined || password == undefined) {
            return res.status(400).json("Email and password are required");
        }
        const existingAccount = yield prisma.auth.findUnique({
            where: {
                email,
            },
        });
        if (existingAccount) {
            return res.status(400).json("Account already exists");
        }
        const hash = bcrypt_1.default.hashSync(password, 10);
        const vetAuth = yield prisma.auth.create({
            data: {
                email,
                passwordHash: hash,
            },
        });
        const vet = yield prisma.vet.create({
            data: {
                email,
                birth_date: new Date().toString(),
                first_name: "",
                last_name: "",
                phone_number: "",
                bank_details: "",
            },
        });
        return res.status(200).json(vet);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
});
exports.registerVet = registerVet;
const registerAdmin = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // return 400 if email or password is missing
        if (email == undefined || password == undefined) {
            return res.status(400).json("Email and password are required");
        }
        const existingAccount = yield prisma.auth.findUnique({
            where: {
                email,
            },
        });
        if (existingAccount)
            return res.status(400).json("Account already exists");
        const hash = bcrypt_1.default.hashSync(password, 10);
        const adminAuth = yield prisma.auth.create({
            data: {
                email,
                passwordHash: hash,
            },
        });
        const admin = yield prisma.admin.create({
            data: {
                email,
                birth_date: new Date().toString(),
                first_name: "",
                last_name: "",
                phone_number: "",
            },
        });
        return res.status(200).json(admin);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
});
exports.registerAdmin = registerAdmin;
const login = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // return 400 if email or password is missing
        if (email == undefined || password == undefined) {
            return res.status(400).json("Email and password are required");
        }
        const userAth = yield prisma.auth.findUnique({
            where: {
                email,
            },
        });
        if (!userAth)
            return res.status(404).json("User Not Found");
        const isValid = bcrypt_1.default.compareSync(password, userAth.passwordHash);
        if (!isValid)
            return res.status(401).json("Wrong password");
        const userProfile = yield prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                pets: true,
            },
        });
        const jwtToken = (0, exports.generateToken)(userProfile === null || userProfile === void 0 ? void 0 : userProfile.id);
        res.status(200).json({ userProfile, jwtToken });
    }
    catch (e) {
        res.status(500).json(e);
    }
});
exports.login = login;
const loginVet = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // return 400 if email or password is missing
        if (email == undefined || password == undefined) {
            return res.status(400).json("Email and password are required");
        }
        const userAth = yield prisma.auth.findUnique({
            where: {
                email,
            },
        });
        if (!userAth)
            return res.status(404).json("Vet Not Found");
        const isValid = bcrypt_1.default.compareSync(password, userAth.passwordHash);
        if (!isValid)
            return res.status(401).json("Wrong password");
        const vetProfile = yield prisma.vet.findUnique({
            where: {
                email,
            },
            include: {
                appointments: true,
                specialities: true,
            },
        });
        const jwtToken = (0, exports.generateToken)(vetProfile === null || vetProfile === void 0 ? void 0 : vetProfile.id);
        res.status(200).json({ vetProfile, jwtToken });
    }
    catch (e) {
        res.status(500).json(e);
    }
});
exports.loginVet = loginVet;
const loginAdmin = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // return 400 if email or password is missing
        if (email == undefined || password == undefined) {
            return res.status(400).json("Email and password are required");
        }
        const userAth = yield prisma.auth.findUnique({
            where: {
                email,
            },
        });
        if (!userAth)
            return res.status(404).json("Admin Not Found");
        const isValid = bcrypt_1.default.compareSync(password, userAth.passwordHash);
        if (!isValid)
            return res.status(401).json("Wrong password");
        const adminProfile = yield prisma.admin.findUnique({
            where: {
                email,
            },
        });
        console.log("Generating token ");
        const jwtToken = (0, exports.generateToken)(adminProfile === null || adminProfile === void 0 ? void 0 : adminProfile.id);
        console.log(jwtToken);
        res.status(200).json({ adminProfile, jwtToken });
    }
    catch (e) {
        res.status(500).json(e);
    }
});
exports.loginAdmin = loginAdmin;
const generateToken = (userId) => {
    try {
        return (0, jsonwebtoken_1.sign)({ userId }, private_key, { algorithm: "RS256" });
    }
    catch (e) {
        console.log(e);
        return JSON.stringify(e);
    }
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        return (0, jsonwebtoken_1.verify)(token, public_key, { algorithms: ["RS256"] });
    }
    catch (e) {
        console.log(e);
        return JSON.stringify(e);
    }
};
exports.verifyToken = verifyToken;
const handleTokenVerification = (req, res) => {
    var _a;
    const token = (_a = req === null || req === void 0 ? void 0 : req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    let payload;
    if (!token)
        return res.status(401).end();
    try {
        payload = (0, exports.verifyToken)(token);
        return payload;
    }
    catch (e) {
        if (e instanceof jsonwebtoken_1.JsonWebTokenError)
            return res.status(401).end();
        return res.status(400).end();
    }
};
exports.handleTokenVerification = handleTokenVerification;
//# sourceMappingURL=authentication.js.map