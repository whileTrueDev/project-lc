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
    `contactId` INTEGER NOT NULL,
    `requests` LONGTEXT,
    `progress` VARCHAR(191) NOT NULL DEFAULT 'registered',
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LiveShopping_streamId_key`(`streamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SellerContacts` ADD CONSTRAINT `SellerContacts_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `SellerContacts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Goods` RENAME INDEX `Goods_goodsInfoId_unique` TO `Goods_goodsInfoId_key`;

-- RenameIndex
ALTER TABLE `GoodsOptionsSupplies` RENAME INDEX `GoodsOptionsSupplies_goodsOptionsId_unique` TO `GoodsOptionsSupplies_goodsOptionsId_key`;
