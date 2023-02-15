/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `blocked` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `channel_actions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `channel_users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_A_fkey";

-- DropForeignKey
ALTER TABLE "_friends" DROP CONSTRAINT "_friends_B_fkey";

-- DropForeignKey
ALTER TABLE "_inviteOnChannel" DROP CONSTRAINT "_inviteOnChannel_B_fkey";

-- DropForeignKey
ALTER TABLE "blocked" DROP CONSTRAINT "blocked_channelBlockedRequesterId_fkey";

-- DropForeignKey
ALTER TABLE "blocked" DROP CONSTRAINT "blocked_channelBlockedTargetId_fkey";

-- DropForeignKey
ALTER TABLE "channel_actions" DROP CONSTRAINT "channel_actions_channelActionRequesterId_fkey";

-- DropForeignKey
ALTER TABLE "channel_actions" DROP CONSTRAINT "channel_actions_channelActionTargetId_fkey";

-- DropForeignKey
ALTER TABLE "channel_users" DROP CONSTRAINT "channel_users_userId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_senderId_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "intraId" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "_friends" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_inviteOnChannel" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "blocked" DROP CONSTRAINT "blocked_pkey",
ALTER COLUMN "channelBlockedTargetId" SET DATA TYPE TEXT,
ALTER COLUMN "channelBlockedRequesterId" SET DATA TYPE TEXT,
ADD CONSTRAINT "blocked_pkey" PRIMARY KEY ("channelBlockedTargetId", "channelBlockedRequesterId");

-- AlterTable
ALTER TABLE "channel_actions" DROP CONSTRAINT "channel_actions_pkey",
ALTER COLUMN "channelActionTargetId" SET DATA TYPE TEXT,
ALTER COLUMN "channelActionRequesterId" SET DATA TYPE TEXT,
ADD CONSTRAINT "channel_actions_pkey" PRIMARY KEY ("channelActionTargetId", "channelActionOnChannelId", "channelActionRequesterId", "type");

-- AlterTable
ALTER TABLE "channel_users" DROP CONSTRAINT "channel_users_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "channel_users_pkey" PRIMARY KEY ("userId", "channelId");

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "senderId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_users" ADD CONSTRAINT "channel_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_actions" ADD CONSTRAINT "channel_actions_channelActionTargetId_fkey" FOREIGN KEY ("channelActionTargetId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_actions" ADD CONSTRAINT "channel_actions_channelActionRequesterId_fkey" FOREIGN KEY ("channelActionRequesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked" ADD CONSTRAINT "blocked_channelBlockedTargetId_fkey" FOREIGN KEY ("channelBlockedTargetId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked" ADD CONSTRAINT "blocked_channelBlockedRequesterId_fkey" FOREIGN KEY ("channelBlockedRequesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_inviteOnChannel" ADD CONSTRAINT "_inviteOnChannel_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
