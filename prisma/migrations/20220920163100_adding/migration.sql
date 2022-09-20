-- AlterTable
ALTER TABLE "Vet" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "PendingPayment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "vet_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,

    CONSTRAINT "PendingPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingPayment_id_key" ON "PendingPayment"("id");

-- AddForeignKey
ALTER TABLE "PendingPayment" ADD CONSTRAINT "PendingPayment_vet_id_fkey" FOREIGN KEY ("vet_id") REFERENCES "Vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
