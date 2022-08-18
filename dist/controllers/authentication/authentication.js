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
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const register = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const hash = bcrypt_1.default.hashSync(password, 10);
    console.log("hash", hash);
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
const login = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
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
        // TODO: Generate JWT token
        const userProfile = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        res.status(200).json(userProfile);
    }
    catch (e) {
        res.status(500).json(e);
    }
});
exports.login = login;
//# sourceMappingURL=authentication.js.map