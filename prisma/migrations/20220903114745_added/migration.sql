-- CreateTable
CREATE TABLE "CommentClinicReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment_id" TEXT NOT NULL,
    "reported_by" TEXT NOT NULL,
    "reporter_type" TEXT NOT NULL,
    CONSTRAINT "CommentClinicReport_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "CommentClinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CommentVetReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment_id" TEXT NOT NULL,
    "reported_by" TEXT NOT NULL,
    "reporter_type" TEXT NOT NULL,
    CONSTRAINT "CommentVetReport_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "CommentVet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentClinicReport_id_key" ON "CommentClinicReport"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CommentVetReport_id_key" ON "CommentVetReport"("id");
