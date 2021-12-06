/*
  Warnings:

  - You are about to drop the column `userId` on the `Broadcaster` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Broadcaster` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Broadcaster` table without a default value. This is not possible if the table is not empty.

*/

-- DropForeignKey
ALTER TABLE `BroadcasterChannel` DROP FOREIGN KEY `BroadcasterChannel_broadcasterId_fkey`;

-- DropForeignKey
ALTER TABLE `BroadcasterAddress` DROP FOREIGN KEY `BroadcasterAddress_broadcasterId_fkey`;

-- DropForeignKey
ALTER TABLE `BroadcasterContacts` DROP FOREIGN KEY `BroadcasterContacts_broadcasterId_fkey`;

-- DropTable
DROP TABLE `Broadcaster`;

-- CreateTable
CREATE TABLE `Broadcaster` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `userName` VARCHAR(20) NOT NULL,
    `userNickname` VARCHAR(20) NULL,
    `avatar` VARCHAR(191) NULL,
    `overlayUrl` VARCHAR(191) NOT NULL,
    `agreementFlag` BOOLEAN NOT NULL DEFAULT false,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleteFlag` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Broadcaster_email_key`(`email`),
    INDEX `Broadcaster_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Broadcaster_overlayUrl_key` ON `Broadcaster`(`overlayUrl`);

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;