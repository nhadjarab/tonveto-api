/*
  Warnings:

  - You are about to alter the column `price` on the `Specialty` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Specialty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" BIGINT NOT NULL,
    "vet_id" TEXT NOT NULL,
    CONSTRAINT "Specialty_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Specialty" ("id", "name", "price", "vet_id") SELECT "id", "name", "price", "vet_id" FROM "Specialty";
DROP TABLE "Specialty";
ALTER TABLE "new_Specialty" RENAME TO "Specialty";
CREATE UNIQUE INDEX "Specialty_id_key" ON "Specialty"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
