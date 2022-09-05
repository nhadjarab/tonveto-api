/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Vet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,identification_order]` on the table `Vet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Vet_email_identification_order_key";

-- CreateIndex
CREATE UNIQUE INDEX "Vet_email_key" ON "Vet"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vet_id_identification_order_key" ON "Vet"("id", "identification_order");
