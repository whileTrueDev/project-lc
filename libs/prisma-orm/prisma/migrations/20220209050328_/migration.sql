-- AlterTable
ALTER TABLE `BroadcasterSettlementItems` MODIFY `sellType` ENUM('liveShopping', 'broadcasterPromotionPage', 'normal') NULL;

-- AlterTable
ALTER TABLE `SellerSettlementItems` MODIFY `sellType` ENUM('liveShopping', 'broadcasterPromotionPage', 'normal') NULL;
