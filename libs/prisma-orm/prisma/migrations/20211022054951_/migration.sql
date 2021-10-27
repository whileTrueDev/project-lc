/*
  Warnings:

  - You are about to alter the column `progress` on the `LiveShopping` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("LiveShopping_progress")`.

*/
-- AlterTable
ALTER TABLE `LiveShopping` MODIFY `progress` ENUM('registered', 'adjusting', 'confirmed', 'canceled') NOT NULL DEFAULT 'registered';
