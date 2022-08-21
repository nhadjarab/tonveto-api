/*
  Warnings:

  - A unique constraint covering the columns `[owner_id]` on the table `Calendar` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Calendar_owner_id_key" ON "Calendar"("owner_id");
