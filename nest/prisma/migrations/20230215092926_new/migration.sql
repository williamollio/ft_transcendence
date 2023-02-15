-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED', 'DIRECTMESSAGE');

-- CreateEnum
CREATE TYPE "ChannelRole" AS ENUM ('USER', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('OFFLINE', 'ONLINE', 'PLAYING');

-- CreateEnum
CREATE TYPE "ChannelActionType" AS ENUM ('BAN', 'MUTE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'OFFLINE';

-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ChannelType" NOT NULL DEFAULT 'PUBLIC',
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "senderId" INTEGER NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_users" (
    "userId" INTEGER NOT NULL,
    "channelId" TEXT NOT NULL,
    "role" "ChannelRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_users_pkey" PRIMARY KEY ("userId","channelId")
);

-- CreateTable
CREATE TABLE "channel_actions" (
    "channelActionTargetId" INTEGER NOT NULL,
    "channelActionOnChannelId" TEXT NOT NULL,
    "channelActionTime" TIMESTAMP(3) NOT NULL,
    "type" "ChannelActionType" NOT NULL,
    "channelActionRequesterId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_actions_pkey" PRIMARY KEY ("channelActionTargetId","channelActionOnChannelId","channelActionRequesterId","type")
);

-- CreateTable
CREATE TABLE "blocked" (
    "channelBlockedTargetId" INTEGER NOT NULL,
    "channelBlockedRequesterId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blocked_pkey" PRIMARY KEY ("channelBlockedTargetId","channelBlockedRequesterId")
);

-- CreateTable
CREATE TABLE "_inviteOnChannel" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "channels_name_key" ON "channels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "channel_actions_channelActionTargetId_channelActionOnChanne_key" ON "channel_actions"("channelActionTargetId", "channelActionOnChannelId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "blocked_channelBlockedRequesterId_channelBlockedTargetId_key" ON "blocked"("channelBlockedRequesterId", "channelBlockedTargetId");

-- CreateIndex
CREATE UNIQUE INDEX "_inviteOnChannel_AB_unique" ON "_inviteOnChannel"("A", "B");

-- CreateIndex
CREATE INDEX "_inviteOnChannel_B_index" ON "_inviteOnChannel"("B");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_users" ADD CONSTRAINT "channel_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_users" ADD CONSTRAINT "channel_users_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_actions" ADD CONSTRAINT "channel_actions_channelActionTargetId_fkey" FOREIGN KEY ("channelActionTargetId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_actions" ADD CONSTRAINT "channel_actions_channelActionOnChannelId_fkey" FOREIGN KEY ("channelActionOnChannelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_actions" ADD CONSTRAINT "channel_actions_channelActionRequesterId_fkey" FOREIGN KEY ("channelActionRequesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked" ADD CONSTRAINT "blocked_channelBlockedTargetId_fkey" FOREIGN KEY ("channelBlockedTargetId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked" ADD CONSTRAINT "blocked_channelBlockedRequesterId_fkey" FOREIGN KEY ("channelBlockedRequesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_inviteOnChannel" ADD CONSTRAINT "_inviteOnChannel_A_fkey" FOREIGN KEY ("A") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_inviteOnChannel" ADD CONSTRAINT "_inviteOnChannel_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
