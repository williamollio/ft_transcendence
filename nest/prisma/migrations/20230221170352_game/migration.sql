-- AlterTable
ALTER TABLE "users" ADD COLUMN     "eloScore" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Match" (
    "gameId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "p1s" INTEGER NOT NULL,
    "p2s" INTEGER NOT NULL,
    "playerOneId" TEXT NOT NULL,
    "playerTwoId" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("gameId")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_playerOneId_fkey" FOREIGN KEY ("playerOneId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_playerTwoId_fkey" FOREIGN KEY ("playerTwoId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
