import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";

// Methods import
import {
  register,
  login,
  registerVet,
  loginVet,
  registerAdmin,
  loginAdmin,
} from "./controllers/authentication/authentication";
import { getUser, updateUser } from "./controllers/user/user";
import { addPet, deletePet, getPet, updatePet } from "./controllers/pet/pet";
import {
  addAppointment,
  cancelAppointments,
  closeTimeSlot,
  getAppointment,
  openTimeSlot,
  updateAppointment,
} from "./controllers/appointment/appointment";
import {
  getVet,
  isVetInClinic,
  joinClinic,
  updateVet,
} from "./controllers/vet/vet";
import {
  addVetToClinic,
  approveNewVet,
  createClinic,
  deleteClinic,
  getClinic,
  getClinicApplicants,
  rejectNewVet,
  removeVetFromClinic,
  updateClinic,
} from "./controllers/clinic/clinic";
import {
  addCalendar,
  deleteCalendar,
  getCalendar,
  updateCalendar,
} from "./controllers/calendar/calendar";
import {
  addSpecialty,
  deleteSpecialty,
  getSpecialty,
  updateSpecialty,
} from "./controllers/specialtiy/specialty";
import {
  addMedicalReport,
  getMedicalReport,
  updateMedicalReport,
} from "./controllers/medical report/medicalReport";
import {
  approveClinic,
  approveCommentReport,
  approveVet,
  getAllAppointments,
  getAllClinicApplications,
  getAllClinics,
  getAllUsers,
  getAllVetApplications,
  getAllVets,
  getCommentReports,
  rejectCommentReport,
} from "./controllers/admin/admin";
import {
  addCommentClinic,
  addCommentVet,
  deleteCommentClinic,
  deleteCommentVet,
  editCommentClinic,
  editCommentVet,
  reportClinicComment,
  reportVetComment,
} from "./controllers/comment/comment";
import {
  addRatingClinic,
  addRatingVet,
  deleteRatingClinic,
  deleteRatingVet,
  editRatingClinic,
  editRatingVet,
} from "./controllers/rating/rating";
import { search } from "./controllers/search/search";

const prisma = new PrismaClient();

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3005;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// ===========AUTHENTICATION ROUTES============

app.post("/register", async (req: Request, res: Response) => {
  try {
    register(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/registerVet", async (req: Request, res: Response) => {
  try {
    registerVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/registerAdmin", async (req: Request, res: Response) => {
  try {
    registerAdmin(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    login(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/loginVet", async (req: Request, res: Response) => {
  try {
    loginVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/loginAdmin", async (req: Request, res: Response) => {
  try {
    loginAdmin(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// ===========USER ROUTES============

app.get("/user/:id", async (req: Request, res: Response) => {
  try {
    getUser(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/user/:id", async (req: Request, res: Response) => {
  try {
    updateUser(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// ===========Vet ROUTES============

app.get("/vet/:id", async (req: Request, res: Response) => {
  try {
    getVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.get("/vetClinics/:id", async (req: Request, res: Response) => {
  try {
    isVetInClinic(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/vet/:id", async (req: Request, res: Response) => {
  try {
    updateVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/joinClinic/:id", async (req: Request, res: Response) => {
  try {
    joinClinic(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// ===========Clinic ROUTES============
app.post("/clinic", async (req: Request, res: Response) => {
  try {
    createClinic(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/clinic/:id", async (req: Request, res: Response) => {
  try {
    updateClinic(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.get("/clinic/:id", async (req: Request, res: Response) => {
  try {
    getClinic(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.get("/clinicApplications/:id", async (req: Request, res: Response) => {
  try {
    getClinicApplicants(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/clinic/:id", async (req: Request, res: Response) => {
  try {
    deleteClinic(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/clinic/vet", async (req: Request, res: Response) => {
  try {
    addVetToClinic(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/clinic/vet/:id", async (req: Request, res: Response) => {
  try {
    approveNewVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/clinic/vet/:id", async (req: Request, res: Response) => {
  try {
    removeVetFromClinic(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.delete(
  "/clinic/vetApplication/:id",
  async (req: Request, res: Response) => {
    try {
      rejectNewVet(req, res, prisma);
    } catch (e) {
      console.log(e);
    }
  }
);

// ===========Pet ROUTES============
app.post("/pet", async (req: Request, res: Response) => {
  try {
    addPet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/pet/:id", async (req: Request, res: Response) => {
  try {
    updatePet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.get("/pet/:id", async (req: Request, res: Response) => {
  try {
    getPet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/pet/:id", async (req: Request, res: Response) => {
  try {
    deletePet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// ===========Appointment ROUTERS============
app.post("/appointment", async (req: Request, res: Response) => {
  try {
    addAppointment(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/appointment/:id", async (req: Request, res: Response) => {
  try {
    updateAppointment(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.get("/appointment/:id", async (req: Request, res: Response) => {
  try {
    getAppointment(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/appointment/:id", async (req: Request, res: Response) => {
  try {
    cancelAppointments(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/closeTimeSlot", async (req: Request, res: Response) => {
  try {
    closeTimeSlot(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/openTimeSlot", async (req: Request, res: Response) => {
  try {
    openTimeSlot(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// ===========Calendar ROUTERS============
app.post("/calendar", async (req: Request, res: Response) => {
  try {
    addCalendar(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/calendar/:id", async (req: Request, res: Response) => {
  try {
    updateCalendar(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.get("/calendar/:id", async (req: Request, res: Response) => {
  try {
    getCalendar(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/calendar/:id", async (req: Request, res: Response) => {
  try {
    deleteCalendar(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// ===========Specialty ROUTERS============
app.post("/specialty", async (req: Request, res: Response) => {
  try {
    addSpecialty(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/specialty/:id", async (req: Request, res: Response) => {
  try {
    updateSpecialty(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.get("/specialty/:id", async (req: Request, res: Response) => {
  try {
    getSpecialty(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/specialty/:id", async (req: Request, res: Response) => {
  try {
    deleteSpecialty(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// ===========Medical Report ROUTERS============
app.post("/report", async (req: Request, res: Response) => {
  try {
    addMedicalReport(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/report/:id", async (req: Request, res: Response) => {
  try {
    updateMedicalReport(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.get("/report/:id", async (req: Request, res: Response) => {
  try {
    getMedicalReport(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// ===========Comment ROUTERS============
app.post("/ratingVet", async (req: Request, res: Response) => {
  try {
    addRatingVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/ratingClinic", async (req: Request, res: Response) => {
  try {
    addRatingClinic(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/ratingVet/:id", async (req: Request, res: Response) => {
  try {
    editRatingVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/ratingClinic/:id", async (req: Request, res: Response) => {
  try {
    editRatingClinic(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/ratingVet/:id", async (req: Request, res: Response) => {
  try {
    deleteRatingVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/ratingClinic/:id", async (req: Request, res: Response) => {
  try {
    deleteRatingClinic(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// ===========Comment ROUTERS============
app.post("/commentVet", async (req: Request, res: Response) => {
  try {
    addCommentVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/commentClinic", async (req: Request, res: Response) => {
  try {
    addCommentClinic(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/reportCommentVet/:id", async (req: Request, res: Response) => {
  try {
    reportVetComment(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.post("/reportCommentClinic/:id", async (req: Request, res: Response) => {
  try {
    reportClinicComment(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/commentVet/:id", async (req: Request, res: Response) => {
  try {
    editCommentVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/commentClinic/:id", async (req: Request, res: Response) => {
  try {
    editCommentClinic(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/commentVet/:id", async (req: Request, res: Response) => {
  try {
    deleteCommentVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/commentClinic/:id", async (req: Request, res: Response) => {
  try {
    deleteCommentClinic(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// ===========Admin ROUTERS============
app.get("/getAllUsers", async (req: Request, res: Response) => {
  try {
    getAllUsers(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});
app.get("/getAllVets", async (req: Request, res: Response) => {
  try {
    getAllVets(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});
app.get("/getAllClinics", async (req: Request, res: Response) => {
  try {
    getAllClinics(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});
app.get("/getAllAppointments", async (req: Request, res: Response) => {
  try {
    getAllAppointments(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.get("/getAllCommentReports", async (req: Request, res: Response) => {
  try {
    getCommentReports(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.get("/getAllVetApplications", async (req: Request, res: Response) => {
  try {
    getAllVetApplications(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.get("/getAllClinicApplications", async (req: Request, res: Response) => {
  try {
    getAllClinicApplications(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/approveClinic/:id", async (req: Request, res: Response) => {
  try {
    approveClinic(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.put("/approveVet/:id", async (req: Request, res: Response) => {
  try {
    approveVet(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/approveCommentReport/:id", async (req: Request, res: Response) => {
  try {
    approveCommentReport(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

app.delete("/rejectCommentReport/:id", async (req: Request, res: Response) => {
  try {
    rejectCommentReport(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// ===========Search ROUTERS============
app.get("/search/:query", async (req: Request, res: Response) => {
  try {
    search(req, res, prisma);
  } catch (e) {
    console.log(e);
  }
});

// API ENDPOINTS
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
