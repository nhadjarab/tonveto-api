-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "pet_id" TEXT,
    "vet_id" TEXT NOT NULL,
    "user_id" TEXT,
    CONSTRAINT "Appointment_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pet" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Appointment_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("date", "id", "pet_id", "time", "user_id", "vet_id") SELECT "date", "id", "pet_id", "time", "user_id", "vet_id" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
CREATE UNIQUE INDEX "Appointment_id_key" ON "Appointment"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
