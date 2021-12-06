/*
  Warnings:

  - You are about to drop the column `afreecaId` on the `Broadcaster` table. All the data in the column will be lost.
  - You are about to drop the column `channelUrl` on the `Broadcaster` table. All the data in the column will be lost.
  - You are about to drop the column `twitchId` on the `Broadcaster` table. All the data in the column will be lost.
  - You are about to drop the column `youtubeId` on the `Broadcaster` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `LiveCommerceRanking` DROP FOREIGN KEY `LiveCommerceRanking_broadcasterId_fkey`;

-- DropForeignKey
ALTER TABLE `LiveShopping` DROP FOREIGN KEY `LiveShopping_broadcasterId_fkey`;

-- AlterTable
ALTER TABLE `Broadcaster` DROP COLUMN `afreecaId`,
    DROP COLUMN `channelUrl`,
    DROP COLUMN `twitchId`,
    DROP COLUMN `youtubeId`,
    ADD COLUMN `agreementFlag` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NULL,
    MODIFY `userNickname` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `LiveCommerceRanking` MODIFY `broadcasterId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `LiveShopping` MODIFY `broadcasterId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `LiveCommerceRanking` ADD CONSTRAINT `LiveCommerceRanking_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;
