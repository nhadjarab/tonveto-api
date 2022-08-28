-- CreateTable
CREATE TABLE "RatingVet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" REAL NOT NULL,
    "vet_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    CONSTRAINT "RatingVet_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RatingVet_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RatingClinic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" REAL NOT NULL,
    "clinic_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    CONSTRAINT "RatingClinic_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RatingClinic_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "RatingVet_id_key" ON "RatingVet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RatingClinic_id_key" ON "RatingClinic"("id");
