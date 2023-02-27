-- AlterEnum
ALTER TYPE "FriendshipStatus" ADD VALUE 'DENY';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "creationMode" BOOLEAN NOT NULL DEFAULT true;
