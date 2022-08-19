/*
  Warnings:

  - You are about to drop the column `breeed` on the `Pet` table. All the data in the column will be lost.
  - Added the required column `breed` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sex" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "crossbreed" BOOLEAN NOT NULL,
    "sterilised" BOOLEAN NOT NULL,
    "owner_id" TEXT NOT NULL,
    CONSTRAINT "Pet_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pet" ("birth_date", "crossbreed", "id", "name", "owner_id", "sex", "species", "sterilised") SELECT "birth_date", "crossbreed", "id", "name", "owner_id", "sex", "species", "sterilised" FROM "Pet";
DROP TABLE "Pet";
ALTER TABLE "new_Pet" RENAME TO "Pet";
CREATE UNIQUE INDEX "Pet_id_key" ON "Pet"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
