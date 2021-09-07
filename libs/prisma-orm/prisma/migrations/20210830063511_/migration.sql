-- DropForeignKey
ALTER TABLE `GoodsConfirmation` DROP FOREIGN KEY `GoodsConfirmation_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SellerSocialAccount` DROP FOREIGN KEY `SellerSocialAccount_ibfk_1`;

-- AddForeignKey
ALTER TABLE `SellerSocialAccount` ADD FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsConfirmation` ADD FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
