/*
  Warnings:

  - The required column `appointment_id` was added to the `CommentVet` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "CommentVet" ADD COLUMN     "appointment_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CommentVet" ADD CONSTRAINT "CommentVet_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
