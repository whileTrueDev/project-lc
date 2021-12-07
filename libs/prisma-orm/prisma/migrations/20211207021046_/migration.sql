/*
  Warnings:

  - You are about to drop the column `streamId` on the `LiveShopping` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `LiveShopping_streamId_key` ON `LiveShopping`;

-- AlterTable
ALTER TABLE `LiveShopping` DROP COLUMN `streamId`;
