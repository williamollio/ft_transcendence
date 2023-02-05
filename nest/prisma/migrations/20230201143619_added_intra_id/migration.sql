/*
  Warnings:

  - A unique constraint covering the columns `[intraId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `intraId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "intraId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_intraId_key" ON "User"("intraId");
