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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.advancedSearch = exports.search = void 0;
const search = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a, e_2, _b;
    try {
        const { query } = req.params;
        if (!query)
            return res.status(400).json("Missing fields");
        const clinics = yield prisma.clinic.findMany({
            where: {
                is_approved: true,
            },
        });
        const vets = yield prisma.vet.findMany({
            include: {
                specialities: true,
            },
            where: {
                is_approved: true,
            },
        });
        let vetsWithRatings = [];
        try {
            for (var vets_1 = __asyncValues(vets), vets_1_1; vets_1_1 = yield vets_1.next(), !vets_1_1.done;) {
                const vet = vets_1_1.value;
                const vetRating = yield prisma.ratingVet.aggregate({
                    where: {
                        vet_id: vet.id,
                    },
                    _avg: {
                        rating: true,
                    },
                });
                vetsWithRatings.push(Object.assign(Object.assign({}, vet), { vetRating }));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (vets_1_1 && !vets_1_1.done && (_a = vets_1.return)) yield _a.call(vets_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        let clinicsWithRatings = [];
        try {
            for (var clinics_1 = __asyncValues(clinics), clinics_1_1; clinics_1_1 = yield clinics_1.next(), !clinics_1_1.done;) {
                const clinic = clinics_1_1.value;
                const clinicRating = yield prisma.ratingClinic.aggregate({
                    where: {
                        clinic_id: clinic.id,
                    },
                    _avg: {
                        rating: true,
                    },
                });
                clinicsWithRatings.push(Object.assign(Object.assign({}, clinic), { clinicRating }));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (clinics_1_1 && !clinics_1_1.done && (_b = clinics_1.return)) yield _b.call(clinics_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // Filter clinics and vets by query
        const filteredClinics = clinicsWithRatings.filter((clinic) => clinic.name.toLowerCase().includes(query.toLowerCase()) ||
            clinic.city.toLowerCase().includes(query.toLowerCase()) ||
            clinic.address.toLowerCase().includes(query.toLowerCase()) ||
            clinic.country.toLowerCase().includes(query.toLowerCase()));
        const filteredVets = vetsWithRatings.filter((vet) => vet.first_name.toLowerCase().includes(query.toLowerCase()) ||
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
const advancedSearch = (req, res, prisma) => __awaiter(void 0, void 0, void 0, function* () {
    var e_3, _c, e_4, _d;
    try {
        const { city, zip_code, clinic_name, vet_name, specialty, address, country, } = req.query;
        const clinics = yield prisma.clinic.findMany({
            where: {
                is_approved: true,
            },
        });
        const vets = yield prisma.vet.findMany({
            include: {
                specialities: true,
            },
            where: {
                is_approved: true,
            },
        });
        let vetsWithRatings = [];
        try {
            for (var vets_2 = __asyncValues(vets), vets_2_1; vets_2_1 = yield vets_2.next(), !vets_2_1.done;) {
                const vet = vets_2_1.value;
                const vetRating = yield prisma.ratingVet.aggregate({
                    where: {
                        vet_id: vet.id,
                    },
                    _avg: {
                        rating: true,
                    },
                });
                vetsWithRatings.push(Object.assign(Object.assign({}, vet), { vetRating }));
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (vets_2_1 && !vets_2_1.done && (_c = vets_2.return)) yield _c.call(vets_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        let clinicsWithRatings = [];
        try {
            for (var clinics_2 = __asyncValues(clinics), clinics_2_1; clinics_2_1 = yield clinics_2.next(), !clinics_2_1.done;) {
                const clinic = clinics_2_1.value;
                const clinicRating = yield prisma.ratingClinic.aggregate({
                    where: {
                        clinic_id: clinic.id,
                    },
                    _avg: {
                        rating: true,
                    },
                });
                clinicsWithRatings.push(Object.assign(Object.assign({}, clinic), { clinicRating }));
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (clinics_2_1 && !clinics_2_1.done && (_d = clinics_2.return)) yield _d.call(clinics_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
        // check if queries are undefined
        if (city == undefined &&
            zip_code == undefined &&
            clinic_name == undefined &&
            vet_name == undefined &&
            specialty == undefined &&
            address == undefined &&
            country == undefined)
            return res.status(200).json({
                filteredClinics: clinicsWithRatings,
                filteredVets: vetsWithRatings,
            });
        // Filter clinics and vets by query
        const filteredClinics = clinics.filter((clinic) => clinic.name
            .toLowerCase()
            .includes(clinic_name === null || clinic_name === void 0 ? void 0 : clinic_name.toLowerCase()) ||
            clinic.city.toLowerCase().includes(city === null || city === void 0 ? void 0 : city.toLowerCase()) ||
            clinic.address
                .toLowerCase()
                .includes(address === null || address === void 0 ? void 0 : address.toLowerCase()) ||
            clinic.zip_code
                .toLowerCase()
                .includes(zip_code === null || zip_code === void 0 ? void 0 : zip_code.toLowerCase()) ||
            clinic.country
                .toLowerCase()
                .includes(country === null || country === void 0 ? void 0 : country.toLowerCase()));
        const filteredVets = vets.filter((vet) => vet.first_name
            .toLowerCase()
            .includes(vet_name === null || vet_name === void 0 ? void 0 : vet_name.toLowerCase()) ||
            vet.last_name
                .toLowerCase()
                .includes(vet_name === null || vet_name === void 0 ? void 0 : vet_name.toLowerCase()) ||
            (vet.first_name + " " + vet.last_name)
                .toLowerCase()
                .includes(vet_name === null || vet_name === void 0 ? void 0 : vet_name.toLowerCase()) ||
            vet.specialities.some((speciality) => speciality.name
                .toLowerCase()
                .includes(specialty === null || specialty === void 0 ? void 0 : specialty.toLowerCase())));
        return res.status(200).json({ filteredClinics, filteredVets });
    }
    catch (e) {
        res.status(500).json(e);
    }
});
exports.advancedSearch = advancedSearch;
//# sourceMappingURL=search.js.map