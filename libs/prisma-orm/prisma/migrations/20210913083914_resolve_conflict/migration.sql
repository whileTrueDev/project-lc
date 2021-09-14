/*
  Warnings:

  - You are about to alter the column `phoneCallEventFlag` on the `LiveCommerceRanking` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `loginFlag` on the `LiveCommerceRanking` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - Added the required column `creatorId` to the `LiveCommerceRanking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `SellerBusinessRegistration` DROP FOREIGN KEY `SellerBusinessRegistration_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SellerBusinessRegistration` DROP FOREIGN KEY `SellerBusinessRegistration_ibfk_2`;

-- DropForeignKey
ALTER TABLE `SellerSettlementAccount` DROP FOREIGN KEY `SellerSettlementAccount_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SellerSettlements` DROP FOREIGN KEY `SellerSettlements_ibfk_1`;

-- AlterTable
ALTER TABLE `LiveCommerceRanking` ADD COLUMN `creatorId` VARCHAR(191) NOT NULL,
    MODIFY `phoneCallEventFlag` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `loginFlag` BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `SellerBusinessRegistration` ADD FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlements` ADD FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementAccount` ADD FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
