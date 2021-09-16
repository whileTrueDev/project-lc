/*
  Warnings:

  - You are about to alter the column `phoneCallEventFlag` on the `LiveCommerceRanking` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `loginFlag` on the `LiveCommerceRanking` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - Added the required column `creatorId` to the `LiveCommerceRanking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LiveCommerceRanking` ADD COLUMN `creatorId` VARCHAR(191) NOT NULL,
    MODIFY `phoneCallEventFlag` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `loginFlag` BOOLEAN NOT NULL DEFAULT true;
