/*
  Warnings:

  - Added the required column `clinic_id` to the `CommentClinicReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vet_id` to the `CommentVetReport` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CommentClinicReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment_id" TEXT NOT NULL,
    "reported_by" TEXT NOT NULL,
    "reporter_type" TEXT NOT NULL,
    "clinic_id" TEXT NOT NULL,
    "report_type" TEXT NOT NULL DEFAULT 'clinic',
    CONSTRAINT "CommentClinicReport_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "CommentClinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CommentClinicReport" ("comment_id", "id", "report_type", "reported_by", "reporter_type") SELECT "comment_id", "id", "report_type", "reported_by", "reporter_type" FROM "CommentClinicReport";
DROP TABLE "CommentClinicReport";
ALTER TABLE "new_CommentClinicReport" RENAME TO "CommentClinicReport";
CREATE UNIQUE INDEX "CommentClinicReport_id_key" ON "CommentClinicReport"("id");
CREATE TABLE "new_CommentVetReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment_id" TEXT NOT NULL,
    "reported_by" TEXT NOT NULL,
    "reporter_type" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    "report_type" TEXT NOT NULL DEFAULT 'vet',
    CONSTRAINT "CommentVetReport_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "CommentVet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CommentVetReport" ("comment_id", "id", "report_type", "reported_by", "reporter_type") SELECT "comment_id", "id", "report_type", "reported_by", "reporter_type" FROM "CommentVetReport";
DROP TABLE "CommentVetReport";
ALTER TABLE "new_CommentVetReport" RENAME TO "CommentVetReport";
CREATE UNIQUE INDEX "CommentVetReport_id_key" ON "CommentVetReport"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
