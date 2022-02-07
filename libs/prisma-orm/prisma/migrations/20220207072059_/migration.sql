-- AlterTable
ALTER TABLE `BroadcasterSettlementItems` ADD COLUMN `sellType` ENUM('liveShopping', 'broadcasterPromotionPage') NULL;

-- AlterTable
ALTER TABLE `SellerSettlementItems` ADD COLUMN `sellType` ENUM('liveShopping', 'broadcasterPromotionPage') NULL;
