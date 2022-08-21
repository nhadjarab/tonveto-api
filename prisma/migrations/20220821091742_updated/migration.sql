/*
  Warnings:

  - Added the required column `vet_id` to the `MedicalReport` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MedicalReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appointment_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    CONSTRAINT "MedicalReport_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MedicalReport_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MedicalReport_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MedicalReport" ("appointment_id", "diagnosis", "id", "notes", "pet_id", "reason", "treatment") SELECT "appointment_id", "diagnosis", "id", "notes", "pet_id", "reason", "treatment" FROM "MedicalReport";
DROP TABLE "MedicalReport";
ALTER TABLE "new_MedicalReport" RENAME TO "MedicalReport";
CREATE UNIQUE INDEX "MedicalReport_id_key" ON "MedicalReport"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
