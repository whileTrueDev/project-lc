-- AlterTable
ALTER TABLE `BroadcasterSettlementItems` ADD COLUMN `sellType` ENUM('liveShopping', 'broadcasterPromotionPage', 'normal') NULL;

-- AlterTable
ALTER TABLE `SellerSettlementItems` ADD COLUMN `sellType` ENUM('liveShopping', 'broadcasterPromotionPage', 'normal') NULL;
