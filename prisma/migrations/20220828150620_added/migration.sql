-- CreateTable
CREATE TABLE "CommentVet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    CONSTRAINT "CommentVet_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CommentClinic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "clinic_id" TEXT NOT NULL,
    CONSTRAINT "CommentClinic_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentVet_id_key" ON "CommentVet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CommentClinic_id_key" ON "CommentClinic"("id");
