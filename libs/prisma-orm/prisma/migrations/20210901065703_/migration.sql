/*
  Warnings:

  - You are about to drop the column `nation` on the `LoginHistory` table. All the data in the column will be lost.
  - Added the required column `country` to the `LoginHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LoginHistory` DROP COLUMN `nation`,
    ADD COLUMN `country` VARCHAR(191) NOT NULL;
