-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "clinic_id" TEXT;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
