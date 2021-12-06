/*
  Warnings:

  - You are about to alter the column `broadcasterId` on the `LiveCommerceRanking` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `broadcasterId` on the `LiveShopping` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `LiveCommerceRanking` DROP FOREIGN KEY `LiveCommerceRanking_broadcasterId_fkey`;

-- DropForeignKey
ALTER TABLE `LiveShopping` DROP FOREIGN KEY `LiveShopping_broadcasterId_fkey`;

-- DropIndex
DROP INDEX `Broadcaster_userId_idx` ON `Broadcaster`;

-- AlterTable
ALTER TABLE `LiveShopping` MODIFY `broadcasterId` INTEGER;