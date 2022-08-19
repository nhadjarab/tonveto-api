-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sex" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breeed" TEXT NOT NULL,
    "crossbreed" BOOLEAN NOT NULL,
    "sterilised" BOOLEAN NOT NULL,
    "owner_id" TEXT NOT NULL,
    CONSTRAINT "Pet_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Pet_id_key" ON "Pet"("id");
