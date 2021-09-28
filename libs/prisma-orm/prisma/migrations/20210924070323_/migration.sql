-- DropForeignKey
ALTER TABLE `Goods` DROP FOREIGN KEY `Goods_ibfk_3`;

-- DropForeignKey
ALTER TABLE `Goods` DROP FOREIGN KEY `Goods_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Goods` DROP FOREIGN KEY `Goods_ibfk_2`;

-- DropForeignKey
ALTER TABLE `GoodsConfirmation` DROP FOREIGN KEY `GoodsConfirmation_ibfk_1`;

-- DropForeignKey
ALTER TABLE `GoodsImages` DROP FOREIGN KEY `GoodsImages_ibfk_1`;

-- DropForeignKey
ALTER TABLE `GoodsInfo` DROP FOREIGN KEY `GoodsInfo_ibfk_1`;

-- DropForeignKey
ALTER TABLE `GoodsOptions` DROP FOREIGN KEY `GoodsOptions_ibfk_1`;

-- DropForeignKey
ALTER TABLE `GoodsOptionsSupplies` DROP FOREIGN KEY `GoodsOptionsSupplies_ibfk_1`;

-- DropForeignKey
ALTER TABLE `LiveCommerceRanking` DROP FOREIGN KEY `LiveCommerceRanking_ibfk_1`;

-- DropForeignKey
ALTER TABLE `LoginHistory` DROP FOREIGN KEY `LoginHistory_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SellerBusinessRegistration` DROP FOREIGN KEY `SellerBusinessRegistration_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SellerSettlementAccount` DROP FOREIGN KEY `SellerSettlementAccount_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SellerSettlements` DROP FOREIGN KEY `SellerSettlements_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SellerShop` DROP FOREIGN KEY `SellerShop_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SellerSocialAccount` DROP FOREIGN KEY `SellerSocialAccount_ibfk_1`;

-- DropForeignKey
ALTER TABLE `ShippingCost` DROP FOREIGN KEY `ShippingCost_ibfk_1`;

-- DropForeignKey
ALTER TABLE `ShippingGroup` DROP FOREIGN KEY `ShippingGroup_ibfk_1`;

-- DropForeignKey
ALTER TABLE `ShippingOption` DROP FOREIGN KEY `ShippingOption_ibfk_1`;

-- DropForeignKey
ALTER TABLE `ShippingSet` DROP FOREIGN KEY `ShippingSet_ibfk_1`;

-- CreateIndex
CREATE INDEX `goodsOptionsId` ON `GoodsOptionsSupplies`(`goodsOptionsId`);

-- AddForeignKey
ALTER TABLE `SellerShop` ADD CONSTRAINT `SellerShop_sellerEmail_fkey` FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerBusinessRegistration` ADD CONSTRAINT `SellerBusinessRegistration_sellerEmail_fkey` FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlements` ADD CONSTRAINT `SellerSettlements_sellerEmail_fkey` FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementAccount` ADD CONSTRAINT `SellerSettlementAccount_sellerEmail_fkey` FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSocialAccount` ADD CONSTRAINT `SellerSocialAccount_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goods` ADD CONSTRAINT `Goods_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goods` ADD CONSTRAINT `Goods_shippingGroupId_fkey` FOREIGN KEY (`shippingGroupId`) REFERENCES `ShippingGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goods` ADD CONSTRAINT `Goods_goodsInfoId_fkey` FOREIGN KEY (`goodsInfoId`) REFERENCES `GoodsInfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsConfirmation` ADD CONSTRAINT `GoodsConfirmation_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsOptions` ADD CONSTRAINT `GoodsOptions_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsOptionsSupplies` ADD CONSTRAINT `GoodsOptionsSupplies_goodsOptionsId_fkey` FOREIGN KEY (`goodsOptionsId`) REFERENCES `GoodsOptions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsImages` ADD CONSTRAINT `GoodsImages_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsInfo` ADD CONSTRAINT `GoodsInfo_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoginHistory` ADD CONSTRAINT `LoginHistory_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingGroup` ADD CONSTRAINT `ShippingGroup_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingSet` ADD CONSTRAINT `ShippingSet_shipping_group_seq_fkey` FOREIGN KEY (`shipping_group_seq`) REFERENCES `ShippingGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingOption` ADD CONSTRAINT `ShippingOption_shipping_set_seq_fkey` FOREIGN KEY (`shipping_set_seq`) REFERENCES `ShippingSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingCost` ADD CONSTRAINT `ShippingCost_shipping_opt_seq_fkey` FOREIGN KEY (`shipping_opt_seq`) REFERENCES `ShippingOption`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveCommerceRanking` ADD CONSTRAINT `LiveCommerceRanking_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Broadcaster` RENAME INDEX `Broadcaster.userId_index` TO `Broadcaster_userId_idx`;

-- RenameIndex
ALTER TABLE `GoodsConfirmation` RENAME INDEX `GoodsConfirmation.goodsId_unique` TO `GoodsConfirmation_goodsId_key`;

-- RenameIndex
ALTER TABLE `Seller` RENAME INDEX `Seller.email_unique` TO `Seller_email_key`;

-- RenameIndex
ALTER TABLE `SellerShop` RENAME INDEX `SellerShop.sellerEmail_unique` TO `SellerShop_sellerEmail_key`;
