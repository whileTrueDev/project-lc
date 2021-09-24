/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `SellerBusinessRegistration` DROP FOREIGN KEY `SellerBusinessRegistration_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SellerSettlementAccount` DROP FOREIGN KEY `SellerSettlementAccount_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SellerSettlements` DROP FOREIGN KEY `SellerSettlements_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SellerShop` DROP FOREIGN KEY `SellerShop_ibfk_1`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `Broadcaster` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(20) NOT NULL,
    `userName` VARCHAR(20) NOT NULL,
    `userNickname` VARCHAR(20) NOT NULL,
    `afreecaId` VARCHAR(191),
    `twitchId` VARCHAR(191),
    `youtubeId` VARCHAR(191),
    `overlayUrl` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleteFlag` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SellerShop` ADD FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerBusinessRegistration` ADD FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlements` ADD FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementAccount` ADD FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterIndex
ALTER TABLE `GoodsConfirmation` RENAME INDEX `GoodsConfirmation_goodsId_unique` TO `GoodsConfirmation.goodsId_unique`;
