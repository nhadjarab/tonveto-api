-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "identification_order" INTEGER NOT NULL DEFAULT 1111111111,
    "profile_complete" BOOLEAN NOT NULL DEFAULT false,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'vet',
    "bank_details" TEXT NOT NULL
);
INSERT INTO "new_Vet" ("bank_details", "birth_date", "email", "first_name", "id", "identification_order", "is_approved", "last_name", "phone_number", "profile_complete", "type") SELECT "bank_details", "birth_date", "email", "first_name", "id", "identification_order", "is_approved", "last_name", "phone_number", "profile_complete", "type" FROM "Vet";
DROP TABLE "Vet";
ALTER TABLE "new_Vet" RENAME TO "Vet";
CREATE UNIQUE INDEX "Vet_id_key" ON "Vet"("id");
CREATE UNIQUE INDEX "Vet_email_identification_order_key" ON "Vet"("email", "identification_order");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
