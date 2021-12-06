/*
  Warnings:

  - You are about to drop the column `broadcasterId` on the `LiveCommerceRanking` table. All the data in the column will be lost.
  - Added the required column `broadcasterEmail` to the `LiveCommerceRanking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `LiveCommerceRanking` DROP FOREIGN KEY `LiveCommerceRanking_broadcasterId_fkey`;

-- AlterTable
ALTER TABLE `LiveCommerceRanking` DROP COLUMN `broadcasterId`,
    ADD COLUMN `broadcasterEmail` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `LiveCommerceRanking` ADD CONSTRAINT `LiveCommerceRanking_broadcasterEmail_fkey` FOREIGN KEY (`broadcasterEmail`) REFERENCES `Broadcaster`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
