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

-- AddForeignKey
ALTER TABLE `BroadcasterPromotionPage` ADD CONSTRAINT `BroadcasterPromotionPage_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPromotion` ADD CONSTRAINT `ProductPromotion_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPromotion` ADD CONSTRAINT `ProductPromotion_broadcasterPromotionPageId_fkey` FOREIGN KEY (`broadcasterPromotionPageId`) REFERENCES `BroadcasterPromotionPage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
