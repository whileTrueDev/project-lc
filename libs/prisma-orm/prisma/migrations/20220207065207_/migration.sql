/*
  Warnings:

  - Added the required column `sellType` to the `BroadcasterSettlementItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellType` to the `SellerSettlementItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BroadcasterSettlementItems` ADD COLUMN `sellType` ENUM('liveShopping', 'broadcasterPromotionPage') NOT NULL;

-- AlterTable
ALTER TABLE `SellerSettlementItems` ADD COLUMN `sellType` ENUM('liveShopping', 'broadcasterPromotionPage') NOT NULL;
