/*
  Warnings:

  - You are about to drop the column `createdAt` on the `LiveCommerceRanking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `LiveCommerceRanking` DROP COLUMN `createdAt`,
    ADD COLUMN `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(20) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `userNickname` VARCHAR(191) NOT NULL,
    `afreecaId` VARCHAR(191) NOT NULL,
    `twitchId` VARCHAR(191) NOT NULL,
    `youtubeId` VARCHAR(191) NOT NULL,
    `overlayUrl` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleteFlag` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
