/*
  Warnings:

  - You are about to drop the column `creatorId` on the `LiveCommerceRanking` table. All the data in the column will be lost.
  - Added the required column `broadcasterId` to the `LiveCommerceRanking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LiveCommerceRanking` DROP COLUMN `creatorId`,
    ADD COLUMN `broadcasterId` VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE INDEX `userId` ON `Broadcaster`(`userId`);

-- AddForeignKey
ALTER TABLE `LiveCommerceRanking` ADD FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
