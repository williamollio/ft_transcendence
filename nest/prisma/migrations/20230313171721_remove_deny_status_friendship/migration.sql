/*
  Warnings:

  - The values [DENY] on the enum `FriendshipStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FriendshipStatus_new" AS ENUM ('REQUESTED', 'ACCEPTED', 'NONE');
ALTER TABLE "friendships" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "friendships" ALTER COLUMN "status" TYPE "FriendshipStatus_new" USING ("status"::text::"FriendshipStatus_new");
ALTER TYPE "FriendshipStatus" RENAME TO "FriendshipStatus_old";
ALTER TYPE "FriendshipStatus_new" RENAME TO "FriendshipStatus";
DROP TYPE "FriendshipStatus_old";
ALTER TABLE "friendships" ALTER COLUMN "status" SET DEFAULT 'NONE';
COMMIT;
