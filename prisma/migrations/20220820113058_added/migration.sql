/*
  Warnings:

  - Added the required column `owner_id` to the `Clinic` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Clinic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    CONSTRAINT "Clinic_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Vet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Clinic" ("address", "city", "country", "id", "name", "phone_number") SELECT "address", "city", "country", "id", "name", "phone_number" FROM "Clinic";
DROP TABLE "Clinic";
ALTER TABLE "new_Clinic" RENAME TO "Clinic";
CREATE UNIQUE INDEX "Clinic_id_key" ON "Clinic"("id");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "profile_complete" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'user'
);
INSERT INTO "new_User" ("birth_date", "email", "first_name", "id", "last_name", "phone_number", "profile_complete") SELECT "birth_date", "email", "first_name", "id", "last_name", "phone_number", "profile_complete" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Vet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "identification_order" INTEGER NOT NULL,
    "profile_complete" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'vet',
    "bank_details" TEXT NOT NULL
);
INSERT INTO "new_Vet" ("bank_details", "birth_date", "email", "first_name", "id", "identification_order", "last_name", "phone_number", "profile_complete") SELECT "bank_details", "birth_date", "email", "first_name", "id", "identification_order", "last_name", "phone_number", "profile_complete" FROM "Vet";
DROP TABLE "Vet";
ALTER TABLE "new_Vet" RENAME TO "Vet";
CREATE UNIQUE INDEX "Vet_id_key" ON "Vet"("id");
CREATE UNIQUE INDEX "Vet_email_key" ON "Vet"("email");
CREATE UNIQUE INDEX "Vet_identification_order_key" ON "Vet"("identification_order");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
