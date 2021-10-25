/*
  Warnings:

  - You are about to drop the column `amount` on the `SellerSettlements` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[exportId]` on the table `SellerSettlements` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `buyer` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exportId` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `round` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingCost` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingId` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LiveShopping` ADD COLUMN `broadcasterCommissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `whiletrueCommissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `SellerSettlements` DROP COLUMN `amount`,
    ADD COLUMN `buyer` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipient` VARCHAR(191) NOT NULL,
    ADD COLUMN `doneDate` DATETIME(3),
    ADD COLUMN `exportId` INTEGER NOT NULL,
    ADD COLUMN `exportCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `orderId` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentMethod` VARCHAR(191),
    ADD COLUMN `pg` VARCHAR(191),
    ADD COLUMN `pgCommission` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `pgCommissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
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
CREATE TABLE `SellerSettlementItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` INTEGER NOT NULL,
    `optionId` INTEGER NOT NULL,
    `ea` INTEGER NOT NULL DEFAULT 0,
    `pricePerPiece` INTEGER NOT NULL DEFAULT 0,
    `price` INTEGER NOT NULL DEFAULT 0,
    `liveShoppingId` INTEGER,
    `sellerSettlementsId` INTEGER,
    `broadcasterCommission` INTEGER NOT NULL DEFAULT 0,
    `broadcasterCommissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `whiletrueCommission` INTEGER NOT NULL DEFAULT 0,
    `whiletrueCommissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `goods_image` VARCHAR(191) COMMENT '상품 대표이미지 fm_goods.image',
    `goods_name` VARCHAR(191) COMMENT '상품명 fm_goods.goods_name',
    `option_title` VARCHAR(191) COMMENT '옵션명 fm_goods_options.option_title',
    `option1` VARCHAR(191) COMMENT '옵션값 fm_goods_options.option1',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellCommission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 5.00,
    `commissionDecimal` DECIMAL(10, 2) NOT NULL DEFAULT 0.05,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `SellerSettlements_exportId_key` ON `SellerSettlements`(`exportId`);

-- AddForeignKey
ALTER TABLE `SellerSettlementItems` ADD CONSTRAINT `SellerSettlementItems_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementItems` ADD CONSTRAINT `SellerSettlementItems_sellerSettlementsId_fkey` FOREIGN KEY (`sellerSettlementsId`) REFERENCES `SellerSettlements`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
