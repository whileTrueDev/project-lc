/*
  Warnings:

  - You are about to drop the column `color` on the `GoodsOptions` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `SellerBusinessRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `SellerSettlements` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[overlayUrl]` on the table `Broadcaster` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[exportId]` on the table `SellerSettlements` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessRegistrationImageName` to the `SellerBusinessRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mailOrderSalesImageName` to the `SellerBusinessRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mailOrderSalesNumber` to the `SellerBusinessRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `settlementAccountImageName` to the `SellerSettlementAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyer` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exportCode` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exportId` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `round` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingId` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Broadcaster` ADD COLUMN `channelUrl` VARCHAR(191);

-- AlterTable
ALTER TABLE `GoodsConfirmation` ADD COLUMN `rejectionReason` TEXT,
    MODIFY `status` ENUM('waiting', 'confirmed', 'rejected', 'needReconfirmation') NOT NULL DEFAULT 'waiting';

-- AlterTable
ALTER TABLE `GoodsImages` MODIFY `goodsId` INTEGER,
    MODIFY `image` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `GoodsOptions` DROP COLUMN `color`;

-- AlterTable
ALTER TABLE `SellerBusinessRegistration` DROP COLUMN `fileName`,
    ADD COLUMN `businessRegistrationImageName` VARCHAR(191) NOT NULL,
    ADD COLUMN `mailOrderSalesImageName` VARCHAR(191) NOT NULL,
    ADD COLUMN `mailOrderSalesNumber` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SellerSettlementAccount` ADD COLUMN `settlementAccountImageName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SellerSettlements` DROP COLUMN `amount`,
    ADD COLUMN `buyer` VARCHAR(191) NOT NULL,
    ADD COLUMN `doneDate` DATETIME(3),
    ADD COLUMN `exportCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `exportId` INTEGER NOT NULL,
    ADD COLUMN `orderId` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentMethod` VARCHAR(191),
    ADD COLUMN `pg` VARCHAR(191),
    ADD COLUMN `pgCommission` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `pgCommissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `recipient` VARCHAR(191) NOT NULL,
    ADD COLUMN `round` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingCost` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `shippingCostIncluded` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `shippingId` INTEGER NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL,
    ADD COLUMN `totalAmount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalCommission` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalEa` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalPrice` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `BusinessRegistrationConfirmation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('waiting', 'confirmed', 'rejected') NOT NULL DEFAULT 'waiting',
    `rejectionReason` TEXT,
    `SellerBusinessRegistrationId` INTEGER NOT NULL,

    UNIQUE INDEX `BusinessRegistrationConfirmation_SellerBusinessRegistrationI_key`(`SellerBusinessRegistrationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellerSettlementItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` INTEGER,
    `optionId` INTEGER,
    `goods_image` VARCHAR(191),
    `goods_name` VARCHAR(191),
    `option_title` VARCHAR(191),
    `option1` VARCHAR(191),
    `ea` INTEGER NOT NULL DEFAULT 0,
    `pricePerPiece` INTEGER NOT NULL DEFAULT 0,
    `price` INTEGER NOT NULL DEFAULT 0,
    `broadcasterCommissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `whiletrueCommissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `broadcasterCommission` INTEGER NOT NULL DEFAULT 0,
    `whiletrueCommission` INTEGER NOT NULL DEFAULT 0,
    `liveShoppingId` INTEGER,
    `sellerSettlementsId` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellerContacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `phoneNumber` VARCHAR(191) NOT NULL DEFAULT '',
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveShopping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `streamId` VARCHAR(191),
    `broadcasterId` VARCHAR(20),
    `sellerId` INTEGER NOT NULL,
    `goodsId` INTEGER NOT NULL,
    `videoId` INTEGER,
    `contactId` INTEGER NOT NULL,
    `requests` LONGTEXT,
    `progress` ENUM('registered', 'adjusting', 'confirmed', 'canceled') NOT NULL DEFAULT 'registered',
    `broadcastStartDate` DATETIME(3),
    `broadcastEndDate` DATETIME(3),
    `sellStartDate` DATETIME(3),
    `sellEndDate` DATETIME(3),
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `rejectionReason` TEXT,
    `broadcasterCommissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `whiletrueCommissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 0,

    UNIQUE INDEX `LiveShopping_streamId_key`(`streamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveShoppingVideo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `youtubeUrl` VARCHAR(191),
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LiveShoppingVideo_youtubeUrl_key`(`youtubeUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellCommission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 5.00,
    `commissionDecimal` DECIMAL(10, 4) NOT NULL DEFAULT 0.05,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `postingFlag` BOOLEAN NOT NULL DEFAULT false,
    `postingDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellerPaymentCommission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `payment` VARCHAR(191) NOT NULL,
    `paymentName` VARCHAR(191) NOT NULL,
    `commissionRate` DECIMAL(10, 2) NOT NULL,
    `commissionUnit` ENUM('P', 'W') NOT NULL DEFAULT 'P',
    `min` INTEGER,
    `max` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellerOrderCancelRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `orderSeq` VARCHAR(191) NOT NULL,
    `status` ENUM('waiting', 'confirmed') NOT NULL DEFAULT 'waiting',
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SellerOrderCancelRequest_orderSeq_idx`(`orderSeq`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellerOrderCancelRequestItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderItemSeq` INTEGER NOT NULL,
    `orderItemOptionSeq` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `orderSeq` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Broadcaster_overlayUrl_key` ON `Broadcaster`(`overlayUrl`);

-- CreateIndex
CREATE INDEX `firstmallGoodsConnectionId` ON `GoodsConfirmation`(`firstmallGoodsConnectionId`);

-- CreateIndex
CREATE UNIQUE INDEX `SellerSettlements_exportId_key` ON `SellerSettlements`(`exportId`);

-- AddForeignKey
ALTER TABLE `BusinessRegistrationConfirmation` ADD CONSTRAINT `BusinessRegistrationConfirmation_SellerBusinessRegistration_fkey` FOREIGN KEY (`SellerBusinessRegistrationId`) REFERENCES `SellerBusinessRegistration`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementItems` ADD CONSTRAINT `SellerSettlementItems_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementItems` ADD CONSTRAINT `SellerSettlementItems_sellerSettlementsId_fkey` FOREIGN KEY (`sellerSettlementsId`) REFERENCES `SellerSettlements`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerContacts` ADD CONSTRAINT `SellerContacts_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `SellerContacts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `LiveShoppingVideo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerOrderCancelRequest` ADD CONSTRAINT `SellerOrderCancelRequest_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerOrderCancelRequestItem` ADD CONSTRAINT `SellerOrderCancelRequestItem_orderSeq_fkey` FOREIGN KEY (`orderSeq`) REFERENCES `SellerOrderCancelRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `GoodsOptionsSupplies` RENAME INDEX `GoodsOptionsSupplies_goodsOptionsId_unique` TO `GoodsOptionsSupplies_goodsOptionsId_key`;
