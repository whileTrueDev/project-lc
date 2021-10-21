/*
  Warnings:

  - A unique constraint covering the columns `[liveShoppingId]` on the table `SellerSettlements` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `round` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LiveShopping` ADD COLUMN `broadcasterCommissionRate` Decimal(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `whiletrueCommissionRate` Decimal(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `SellerSettlements` ADD COLUMN `broadcasterCommission` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `broadcasterCommissionRate` Decimal(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `doneDate` DATETIME(3),
    ADD COLUMN `liveShoppingId` INTEGER,
    ADD COLUMN `paymentMethod` VARCHAR(191),
    ADD COLUMN `pg` VARCHAR(191),
    ADD COLUMN `pgCommission` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `pgCommissionRate` Decimal(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `round` VARCHAR(191) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL,
    ADD COLUMN `totalCommission` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalCommissionRate` Decimal(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `whiletrueCommission` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `whiletrueCommissionRate` Decimal(10, 2) NOT NULL DEFAULT 0.00;

-- CreateTable
CREATE TABLE `SellerSettlementItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` VARCHAR(191),
    `sellerSettlementsId` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellerSettlementItemOptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` VARCHAR(191),
    `optionId` VARCHAR(191),
    `sellerSettlementsItemsId` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellCommission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commissionRate` Decimal(10, 2) NOT NULL DEFAULT 5.00,
    `commissionDecimal` Decimal(10, 2) NOT NULL DEFAULT 0.05,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `SellerSettlements_liveShoppingId_key` ON `SellerSettlements`(`liveShoppingId`);

-- AddForeignKey
ALTER TABLE `SellerSettlements` ADD CONSTRAINT `SellerSettlements_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementItems` ADD CONSTRAINT `SellerSettlementItems_sellerSettlementsId_fkey` FOREIGN KEY (`sellerSettlementsId`) REFERENCES `SellerSettlements`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementItemOptions` ADD CONSTRAINT `SellerSettlementItemOptions_sellerSettlementsItemsId_fkey` FOREIGN KEY (`sellerSettlementsItemsId`) REFERENCES `SellerSettlementItems`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
