-- AlterTable
ALTER TABLE "users" ADD COLUMN     "secondFactorCode" TEXT,
ADD COLUMN     "secondFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "secondFactorLogged" BOOLEAN NOT NULL DEFAULT false;
