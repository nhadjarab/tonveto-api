-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CommentVetReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment_id" TEXT NOT NULL,
    "reported_by" TEXT NOT NULL,
    "reporter_type" TEXT NOT NULL,
    "report_type" TEXT NOT NULL DEFAULT 'vet',
    CONSTRAINT "CommentVetReport_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "CommentVet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CommentVetReport" ("comment_id", "id", "reported_by", "reporter_type") SELECT "comment_id", "id", "reported_by", "reporter_type" FROM "CommentVetReport";
DROP TABLE "CommentVetReport";
ALTER TABLE "new_CommentVetReport" RENAME TO "CommentVetReport";
CREATE UNIQUE INDEX "CommentVetReport_id_key" ON "CommentVetReport"("id");
CREATE TABLE "new_CommentClinicReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment_id" TEXT NOT NULL,
    "reported_by" TEXT NOT NULL,
    "reporter_type" TEXT NOT NULL,
    "report_type" TEXT NOT NULL DEFAULT 'clinic',
    CONSTRAINT "CommentClinicReport_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "CommentClinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CommentClinicReport" ("comment_id", "id", "reported_by", "reporter_type") SELECT "comment_id", "id", "reported_by", "reporter_type" FROM "CommentClinicReport";
DROP TABLE "CommentClinicReport";
ALTER TABLE "new_CommentClinicReport" RENAME TO "CommentClinicReport";
CREATE UNIQUE INDEX "CommentClinicReport_id_key" ON "CommentClinicReport"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
