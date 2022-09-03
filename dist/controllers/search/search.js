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
exports.search = void 0;
const search = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.params;
        const clinics = yield prisma.clinic.findMany({});
        const vets = yield prisma.vet.findMany({
            include: {
                specialities: true,
            },
        });
        // Filter clinics and vets by query
        const filteredClinics = clinics.filter((clinic) => clinic.name.toLowerCase().includes(query.toLowerCase()) ||
            clinic.city.toLowerCase().includes(query.toLowerCase()) ||
            clinic.address.toLowerCase().includes(query.toLowerCase()) ||
            clinic.country.toLowerCase().includes(query.toLowerCase()));
        const filteredVets = vets.filter((vet) => vet.first_name.toLowerCase().includes(query.toLowerCase()) ||
            vet.last_name.toLowerCase().includes(query.toLowerCase()) ||
            (vet.first_name + " " + vet.last_name)
                .toLowerCase()
                .includes(query.toLowerCase()) ||
            vet.specialities.some((speciality) => speciality.name.toLowerCase().includes(query.toLowerCase())));
        return res.status(200).json({ filteredClinics, filteredVets });
    }
    catch (e) {
        res.status(500).json(e);
    }
});
exports.search = search;
//# sourceMappingURL=search.js.map