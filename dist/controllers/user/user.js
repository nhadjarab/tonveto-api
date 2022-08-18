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
exports.updateUser = void 0;
const authentication_1 = require("../authentication/authentication");
const updateUser = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, birth_date, phone_number, profile_complete, } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != id)
            return res.status(401).json("Unauthorized");
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
                profile_complete,
            },
        });
        res.status(200).json(userProfile);
    }
    catch (e) {
        res.status(500).json(e);
    }
});
exports.updateUser = updateUser;
//# sourceMappingURL=user.js.map