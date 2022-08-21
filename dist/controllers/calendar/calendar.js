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
exports.deleteCalendar = exports.getCalendar = exports.updateCalendar = exports.addCalendar = void 0;
const authentication_1 = require("../authentication/authentication");
const addCalendar = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { monday, tuesday, wednesday, thursday, friday, saturday, sunday, owner_id, } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != owner_id)
            return res.status(401).json("Unauthorized");
        const doesUserExist = yield prisma.vet.findUnique({
            where: {
                id: owner_id,
            },
        });
        if (!doesUserExist)
            return res.status(404).json("Vet does not exist");
        if (!doesUserExist.is_approved)
            return res.status(400).json("Vet is not approved yet");
        const newCalendar = yield prisma.calendar.create({
            data: {
                monday: JSON.stringify(monday),
                tuesday: JSON.stringify(tuesday),
                wednesday: JSON.stringify(wednesday),
                thursday: JSON.stringify(thursday),
                friday: JSON.stringify(friday),
                saturday: JSON.stringify(saturday),
                sunday: JSON.stringify(sunday),
                owner_id: owner_id,
            },
        });
        res.status(200).json(newCalendar);
    }
    catch (e) {
        console.log(e);
    }
});
exports.addCalendar = addCalendar;
const updateCalendar = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { monday, tuesday, wednesday, thursday, friday, saturday, sunday, owner_id, } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != owner_id)
            return res.status(401).json("Unauthorized");
        const doesUserExist = yield prisma.vet.findUnique({
            where: {
                id: owner_id,
            },
        });
        if (!doesUserExist)
            return res.status(404).json("Vet does not exist");
        if (!doesUserExist.is_approved)
            return res.status(400).json("Vet is not approved yet");
        const calendar = yield prisma.calendar.findUnique({
            where: {
                id,
            },
        });
        if (!calendar)
            return res.status(404).json("Calendar does not exist");
        if (calendar.owner_id != owner_id)
            return res
                .status(401)
                .json("No calendar with that id exists on this vet");
        const newCalendar = yield prisma.calendar.update({
            where: {
                id,
            },
            data: {
                monday: JSON.stringify(monday),
                tuesday: JSON.stringify(tuesday),
                wednesday: JSON.stringify(wednesday),
                thursday: JSON.stringify(thursday),
                friday: JSON.stringify(friday),
                saturday: JSON.stringify(saturday),
                sunday: JSON.stringify(sunday),
                owner_id: owner_id,
            },
        });
        res.status(200).json(newCalendar);
    }
    catch (e) {
        console.log(e);
    }
});
exports.updateCalendar = updateCalendar;
const getCalendar = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { logged_in_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != logged_in_id)
            return res.status(401).json("Unauthorized");
        const calendar = yield prisma.calendar.findFirst({
            where: { owner_id: id },
            include: {
                vet: true,
            },
        });
        if (!calendar)
            return res.status(404).json("Calendar not found");
        res.status(200).json(calendar);
    }
    catch (e) {
        console.log(e);
    }
});
exports.getCalendar = getCalendar;
const deleteCalendar = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { owner_id } = req.body;
        const payload = (0, authentication_1.handleTokenVerification)(req, res);
        if (payload.userId != owner_id)
            return res.status(401).json("Unauthorized");
        const calendar = yield prisma.calendar.findUnique({
            where: {
                id,
            },
        });
        if (!calendar)
            return res.status(404).json("Calendar not found");
        if (calendar.owner_id != owner_id)
            return res.status(401).json("Unauthorized");
        const removedCalendar = yield prisma.calendar.delete({
            where: {
                id,
            },
        });
        res.status(200).json("Calendar deleted successfully");
    }
    catch (e) {
        console.log(e);
    }
});
exports.deleteCalendar = deleteCalendar;
//# sourceMappingURL=calendar.js.map