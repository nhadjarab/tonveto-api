-- DropForeignKey
ALTER TABLE "CommentClinic" DROP CONSTRAINT "CommentClinic_clinic_id_fkey";

-- DropForeignKey
ALTER TABLE "CommentClinic" DROP CONSTRAINT "CommentClinic_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "CommentClinic" DROP CONSTRAINT "CommentClinic_rating_id_fkey";

-- DropForeignKey
ALTER TABLE "CommentClinicReport" DROP CONSTRAINT "CommentClinicReport_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "CommentVet" DROP CONSTRAINT "CommentVet_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "CommentVet" DROP CONSTRAINT "CommentVet_rating_id_fkey";

-- DropForeignKey
ALTER TABLE "CommentVet" DROP CONSTRAINT "CommentVet_vet_id_fkey";

-- DropForeignKey
ALTER TABLE "CommentVetReport" DROP CONSTRAINT "CommentVetReport_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "MedicalReport" DROP CONSTRAINT "MedicalReport_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "RatingClinic" DROP CONSTRAINT "RatingClinic_clinic_id_fkey";

-- DropForeignKey
ALTER TABLE "RatingClinic" DROP CONSTRAINT "RatingClinic_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "RatingVet" DROP CONSTRAINT "RatingVet_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "RatingVet" DROP CONSTRAINT "RatingVet_vet_id_fkey";

-- DropForeignKey
ALTER TABLE "Specialty" DROP CONSTRAINT "Specialty_vet_id_fkey";

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specialty" ADD CONSTRAINT "Specialty_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalReport" ADD CONSTRAINT "MedicalReport_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVet" ADD CONSTRAINT "CommentVet_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVet" ADD CONSTRAINT "CommentVet_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVet" ADD CONSTRAINT "CommentVet_rating_id_fkey" FOREIGN KEY ("rating_id") REFERENCES "RatingVet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentClinic" ADD CONSTRAINT "CommentClinic_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentClinic" ADD CONSTRAINT "CommentClinic_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentClinic" ADD CONSTRAINT "CommentClinic_rating_id_fkey" FOREIGN KEY ("rating_id") REFERENCES "RatingClinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingVet" ADD CONSTRAINT "RatingVet_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingVet" ADD CONSTRAINT "RatingVet_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingClinic" ADD CONSTRAINT "RatingClinic_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingClinic" ADD CONSTRAINT "RatingClinic_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentClinicReport" ADD CONSTRAINT "CommentClinicReport_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "CommentClinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentVetReport" ADD CONSTRAINT "CommentVetReport_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "CommentVet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
