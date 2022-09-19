-- CreateTable
CREATE TABLE "Auth" (
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "crossbreed" BOOLEAN NOT NULL,
    "sterilised" BOOLEAN NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "profile_complete" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vet" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "identification_order" TEXT NOT NULL DEFAULT '1111111111',
    "profile_complete" BOOLEAN NOT NULL DEFAULT false,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'vet',
    "bank_details" TEXT NOT NULL,

    CONSTRAINT "Vet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VetClinic" (
    "id" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    "clinic_id" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VetClinic_pkey" PRIMARY KEY ("vet_id","clinic_id")
);

-- CreateTable
CREATE TABLE "Specialty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "pet_id" TEXT,
    "vet_id" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "id" TEXT NOT NULL,
    "monday" TEXT NOT NULL,
    "tuesday" TEXT NOT NULL,
    "wednesday" TEXT NOT NULL,
    "thursday" TEXT NOT NULL,
    "friday" TEXT NOT NULL,
    "saturday" TEXT NOT NULL,
    "sunday" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalReport" (
    "id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,

    CONSTRAINT "MedicalReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'admin',

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentVet" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "CommentVet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentClinic" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "clinic_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "CommentClinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RatingVet" (
    "id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "vet_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "RatingVet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RatingClinic" (
    "id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "clinic_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "RatingClinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentClinicReport" (
    "id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "reported_by" TEXT NOT NULL,
    "reporter_type" TEXT NOT NULL,
    "clinic_id" TEXT NOT NULL,
    "report_type" TEXT NOT NULL DEFAULT 'clinic',

    CONSTRAINT "CommentClinicReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentVetReport" (
    "id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "reported_by" TEXT NOT NULL,
    "reporter_type" TEXT NOT NULL,
    "vet_id" TEXT NOT NULL,
    "report_type" TEXT NOT NULL DEFAULT 'vet',

    CONSTRAINT "CommentVetReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pet_id_key" ON "Pet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vet_id_key" ON "Vet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Vet_email_key" ON "Vet"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vet_id_identification_order_key" ON "Vet"("id", "identification_order");

-- CreateIndex
CREATE UNIQUE INDEX "VetClinic_id_key" ON "VetClinic"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_id_key" ON "Specialty"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_id_key" ON "Clinic"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_id_key" ON "Appointment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_id_key" ON "Calendar"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_owner_id_key" ON "Calendar"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalReport_id_key" ON "MedicalReport"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_id_key" ON "Admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CommentVet_id_key" ON "CommentVet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CommentClinic_id_key" ON "CommentClinic"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RatingVet_id_key" ON "RatingVet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RatingClinic_id_key" ON "RatingClinic"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CommentClinicReport_id_key" ON "CommentClinicReport"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CommentVetReport_id_key" ON "CommentVetReport"("id");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VetClinic" ADD CONSTRAINT "VetClinic_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VetClinic" ADD CONSTRAINT "VetClinic_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specialty" ADD CONSTRAINT "Specialty_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clinic" ADD CONSTRAINT "Clinic_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalReport" ADD CONSTRAINT "MedicalReport_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalReport" ADD CONSTRAINT "MedicalReport_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalReport" ADD CONSTRAINT "MedicalReport_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVet" ADD CONSTRAINT "CommentVet_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVet" ADD CONSTRAINT "CommentVet_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentClinic" ADD CONSTRAINT "CommentClinic_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentClinic" ADD CONSTRAINT "CommentClinic_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingVet" ADD CONSTRAINT "RatingVet_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingVet" ADD CONSTRAINT "RatingVet_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingClinic" ADD CONSTRAINT "RatingClinic_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingClinic" ADD CONSTRAINT "RatingClinic_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentClinicReport" ADD CONSTRAINT "CommentClinicReport_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "CommentClinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVetReport" ADD CONSTRAINT "CommentVetReport_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "CommentVet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
