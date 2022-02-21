-- DropForeignKey
ALTER TABLE `BroadcasterSettlementItems` DROP FOREIGN KEY `BroadcasterSettlementItems_liveShoppingId_fkey`;

-- DropForeignKey
ALTER TABLE `SellerSettlementItems` DROP FOREIGN KEY `SellerSettlementItems_liveShoppingId_fkey`;

-- AlterTable
ALTER TABLE `BroadcasterSettlementItems` ADD COLUMN `broadcasterCommissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `productPromotionId` INTEGER NULL,
    ADD COLUMN `sellType` ENUM('liveShopping', 'productPromotion', 'normal') NULL;

-- AlterTable
ALTER TABLE `SellerSettlementItems` ADD COLUMN `productPromotionId` INTEGER NULL,
    ADD COLUMN `sellType` ENUM('liveShopping', 'productPromotion', 'normal') NULL;

-- CreateTable
CREATE TABLE `BroadcasterPromotionPage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NULL,
    `broadcasterId` INTEGER NOT NULL,

    UNIQUE INDEX `BroadcasterPromotionPage_url_key`(`url`),
    UNIQUE INDEX `BroadcasterPromotionPage_broadcasterId_key`(`broadcasterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductPromotion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fmGoodsSeq` INTEGER NULL,
    `goodsId` INTEGER NOT NULL,
    `broadcasterPromotionPageId` INTEGER NOT NULL,
    `broadcasterCommissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 5,
    `whiletrueCommissionRate` DECIMAL(10, 2) NOT NULL DEFAULT 5,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Policy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` ENUM('termsOfService', 'privacy') NOT NULL,
    `targetUser` ENUM('seller', 'broadcaster', 'all') NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `enforcementDate` DATETIME(3) NULL,
    `version` VARCHAR(191) NOT NULL,
    `publicFlag` BOOLEAN NOT NULL DEFAULT false,
    `content` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SellerSettlementItems` ADD CONSTRAINT `SellerSettlementItems_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementItems` ADD CONSTRAINT `SellerSettlementItems_productPromotionId_fkey` FOREIGN KEY (`productPromotionId`) REFERENCES `ProductPromotion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterSettlementItems` ADD CONSTRAINT `BroadcasterSettlementItems_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterSettlementItems` ADD CONSTRAINT `BroadcasterSettlementItems_productPromotionId_fkey` FOREIGN KEY (`productPromotionId`) REFERENCES `ProductPromotion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterPromotionPage` ADD CONSTRAINT `BroadcasterPromotionPage_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPromotion` ADD CONSTRAINT `ProductPromotion_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPromotion` ADD CONSTRAINT `ProductPromotion_broadcasterPromotionPageId_fkey` FOREIGN KEY (`broadcasterPromotionPageId`) REFERENCES `BroadcasterPromotionPage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
