-- CreateTable
CREATE TABLE `SellerContacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `phoneNumber` VARCHAR(191) NOT NULL DEFAULT '',
    `isDefault` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SellerContacts` ADD CONSTRAINT `SellerContacts_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Goods` RENAME INDEX `Goods_goodsInfoId_unique` TO `Goods_goodsInfoId_key`;

-- RenameIndex
ALTER TABLE `GoodsOptionsSupplies` RENAME INDEX `GoodsOptionsSupplies_goodsOptionsId_unique` TO `GoodsOptionsSupplies_goodsOptionsId_key`;
