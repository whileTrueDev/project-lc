/*
  Warnings:

  - You are about to drop the column `sellerId` on the `LoginHistory` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `LoginHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userType` to the `LoginHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `LoginHistory` DROP FOREIGN KEY `LoginHistory_sellerId_fkey`;

-- AlterTable
ALTER TABLE `LoginHistory` DROP COLUMN `sellerId`,
    ADD COLUMN `userEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `userType` VARCHAR(191) NOT NULL;
