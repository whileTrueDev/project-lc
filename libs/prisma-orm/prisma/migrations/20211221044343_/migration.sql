/*
  Warnings:

  - You are about to drop the column `readState` on the `UserNotification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserNotification` DROP COLUMN `readState`,
    ADD COLUMN `readFlag` BOOLEAN NOT NULL DEFAULT false;
