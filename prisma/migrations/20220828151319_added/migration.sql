/*
  Warnings:

  - Added the required column `owner_id` to the `CommentVet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `CommentClinic` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CommentVet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    CONSTRAINT "CommentVet_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentVet_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CommentVet" ("id", "text", "vet_id") SELECT "id", "text", "vet_id" FROM "CommentVet";
DROP TABLE "CommentVet";
ALTER TABLE "new_CommentVet" RENAME TO "CommentVet";
CREATE UNIQUE INDEX "CommentVet_id_key" ON "CommentVet"("id");
CREATE TABLE "new_CommentClinic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "clinic_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    CONSTRAINT "CommentClinic_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentClinic_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CommentClinic" ("clinic_id", "id", "text") SELECT "clinic_id", "id", "text" FROM "CommentClinic";
DROP TABLE "CommentClinic";
ALTER TABLE "new_CommentClinic" RENAME TO "CommentClinic";
CREATE UNIQUE INDEX "CommentClinic_id_key" ON "CommentClinic"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
