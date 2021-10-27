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

-- CreateTable
CREATE TABLE `SellerPaymentCommission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `payment` VARCHAR(191) NOT NULL,
    `paymentName` VARCHAR(191) NOT NULL,
    `commissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `commissionUnit` ENUM('P','W') NOT NULL DEFAULT 'P' COMMENT '수수료 단위(원/비율)',
    `min` INTEGER,
    `max` INTEGER,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert defuault values to SellerPaymentCommission
INSERT INTO `SellerPaymentCommission` (
    `type`,
    `payment`,
    `paymentName`,
    `commissionRate`,
    `commissionUnit`,
    `min`,
    `max`
) VALUES
    ("toss", "card", "토스페이먼츠-카드", 2.42, 'P', 0, 0 ),
    ("toss", "account", "토스페이먼츠-계좌이체", 1.98, 'P', 220, 0),
    ("toss", "virtual", "토스페이먼츠-가상계좌", 0, 'W', 330, 0),
    ("npay", "bojo", "네이버페이 - 보조결제", 3.74, 'P', 0, 0),
    ("npay", "virtual", "네이버페이 - 가상계좌", 1.00, 'P', 0, 275),
    ("npay", "card", "네이버페이 - 카드", 2.20, 'P', 0, 0),
    ("npay", "account", "네이버페이 - 계좌이체", 1.65, 'P', 0, 0),
    ("npay", "cellphone", "네이버페이 - 휴대폰결제", 3.85, 'P', 0, 0);

-- CreateIndex
CREATE UNIQUE INDEX `SellerSettlements_exportId_key` ON `SellerSettlements`(`exportId`);

-- AddForeignKey
ALTER TABLE `SellerSettlementItems` ADD CONSTRAINT `SellerSettlementItems_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementItems` ADD CONSTRAINT `SellerSettlementItems_sellerSettlementsId_fkey` FOREIGN KEY (`sellerSettlementsId`) REFERENCES `SellerSettlements`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
