-- DropForeignKey
ALTER TABLE `SellerSettlementItems` DROP FOREIGN KEY `SellerSettlementItems_liveShoppingId_fkey`;

-- AlterTable
ALTER TABLE `SellerSettlementItems` ADD COLUMN `productPromotionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `SellerSettlementItems` ADD CONSTRAINT `SellerSettlementItems_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementItems` ADD CONSTRAINT `SellerSettlementItems_productPromotionId_fkey` FOREIGN KEY (`productPromotionId`) REFERENCES `ProductPromotion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
