/*
  Warnings:

  - You are about to drop the column `vetId` on the `Calendar` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Calendar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "monday" TEXT NOT NULL,
    "tuesday" TEXT NOT NULL,
    "wednesday" TEXT NOT NULL,
    "thursday" TEXT NOT NULL,
    "friday" TEXT NOT NULL,
    "saturday" TEXT NOT NULL,
    "sunday" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    CONSTRAINT "Calendar_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Vet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Calendar" ("friday", "id", "monday", "owner_id", "saturday", "sunday", "thursday", "tuesday", "wednesday") SELECT "friday", "id", "monday", "owner_id", "saturday", "sunday", "thursday", "tuesday", "wednesday" FROM "Calendar";
DROP TABLE "Calendar";
ALTER TABLE "new_Calendar" RENAME TO "Calendar";
CREATE UNIQUE INDEX "Calendar_id_key" ON "Calendar"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
