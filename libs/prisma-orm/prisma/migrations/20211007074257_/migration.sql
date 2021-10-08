/*
  Warnings:

  - Added the required column `settlementAccountImageName` to the `SellerSettlementAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SellerSettlementAccount` ADD COLUMN `settlementAccountImageName` VARCHAR(191) NOT NULL;
