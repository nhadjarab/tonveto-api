-- CreateTable
CREATE TABLE "Auth" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "passwordHash" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birth_date" DATETIME NOT NULL,
    "phone_number" TEXT NOT NULL,
    "fully_registered" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
