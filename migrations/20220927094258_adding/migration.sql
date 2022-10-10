-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_clinic_id_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_pet_id_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_vet_id_fkey";

-- DropForeignKey
ALTER TABLE "VetClinic" DROP CONSTRAINT "VetClinic_clinic_id_fkey";

-- DropForeignKey
ALTER TABLE "VetClinic" DROP CONSTRAINT "VetClinic_vet_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_subscribed" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "VetClinic" ADD CONSTRAINT "VetClinic_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VetClinic" ADD CONSTRAINT "VetClinic_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
