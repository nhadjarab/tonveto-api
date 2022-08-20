-- CreateTable
CREATE TABLE "VetClinic" (
    "id" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    "clinic_id" TEXT NOT NULL,

    PRIMARY KEY ("vet_id", "clinic_id"),
    CONSTRAINT "VetClinic_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VetClinic_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Clinic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VetClinic_id_key" ON "VetClinic"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_id_key" ON "Clinic"("id");
