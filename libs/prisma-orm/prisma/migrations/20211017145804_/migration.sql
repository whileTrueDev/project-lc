/*
  Warnings:

  - You are about to drop the column `endBroadcastDate` on the `LiveShopping` table. All the data in the column will be lost.
  - You are about to drop the column `endSellDate` on the `LiveShopping` table. All the data in the column will be lost.
  - You are about to drop the column `startBroadcastDate` on the `LiveShopping` table. All the data in the column will be lost.
  - You are about to drop the column `startSellDate` on the `LiveShopping` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `LiveShopping` DROP COLUMN `endBroadcastDate`,
    DROP COLUMN `endSellDate`,
    DROP COLUMN `startBroadcastDate`,
    DROP COLUMN `startSellDate`,
    ADD COLUMN `broadcastEndDate` DATETIME(3),
    ADD COLUMN `broadcastStartDate` DATETIME(3),
    ADD COLUMN `sellEndDate` DATETIME(3),
    ADD COLUMN `sellStartDate` DATETIME(3);
