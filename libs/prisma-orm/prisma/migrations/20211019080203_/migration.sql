-- DropForeignKey
ALTER TABLE `LiveShopping` DROP FOREIGN KEY `LiveShopping_contactId_fkey`;

-- DropForeignKey
ALTER TABLE `LiveShopping` DROP FOREIGN KEY `LiveShopping_goodsId_fkey`;

-- DropForeignKey
ALTER TABLE `LiveShopping` DROP FOREIGN KEY `LiveShopping_sellerId_fkey`;

-- AlterTable
ALTER TABLE `LiveShopping` ADD COLUMN `broadcastEndDate` DATETIME(3),
    ADD COLUMN `broadcastStartDate` DATETIME(3),
    ADD COLUMN `rejectionReason` TEXT,
    ADD COLUMN `sellEndDate` DATETIME(3),
    ADD COLUMN `sellStartDate` DATETIME(3),
    ADD COLUMN `videoId` INTEGER;

-- CreateTable
CREATE TABLE `LiveShoppingVideo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `youtubeUrl` VARCHAR(191),
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LiveShoppingVideo_youtubeUrl_key`(`youtubeUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `SellerContacts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `LiveShoppingVideo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
