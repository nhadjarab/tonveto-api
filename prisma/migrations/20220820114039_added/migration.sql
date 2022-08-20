-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VetClinic" (
    "id" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    "clinic_id" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("vet_id", "clinic_id"),
    CONSTRAINT "VetClinic_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VetClinic_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_VetClinic" ("clinic_id", "id", "vet_id") SELECT "clinic_id", "id", "vet_id" FROM "VetClinic";
DROP TABLE "VetClinic";
ALTER TABLE "new_VetClinic" RENAME TO "VetClinic";
CREATE UNIQUE INDEX "VetClinic_id_key" ON "VetClinic"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
