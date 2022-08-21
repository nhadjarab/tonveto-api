/*
  Warnings:

  - Added the required column `price` to the `Specialty` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Specialty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "vet_id" TEXT NOT NULL,
    CONSTRAINT "Specialty_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Specialty" ("id", "name", "vet_id") SELECT "id", "name", "vet_id" FROM "Specialty";
DROP TABLE "Specialty";
ALTER TABLE "new_Specialty" RENAME TO "Specialty";
CREATE UNIQUE INDEX "Specialty_id_key" ON "Specialty"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
