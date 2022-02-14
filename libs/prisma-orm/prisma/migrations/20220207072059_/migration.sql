-- AlterTable
ALTER TABLE `BroadcasterSettlementItems` ADD COLUMN `sellType` ENUM('liveShopping', 'productPromotion', 'normal') NULL;

-- AlterTable
ALTER TABLE `SellerSettlementItems` ADD COLUMN `sellType` ENUM('liveShopping', 'productPromotion', 'normal') NULL;
