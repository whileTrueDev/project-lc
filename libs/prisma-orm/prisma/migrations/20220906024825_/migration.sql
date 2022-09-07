-- DropForeignKey
ALTER TABLE `LiveShopping` DROP FOREIGN KEY `LiveShopping_goodsId_fkey`;

-- AlterTable
ALTER TABLE `LiveShopping` MODIFY `goodsId` INTEGER NULL;

-- CreateTable
CREATE TABLE `LiveShoppingExternalGoods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `linkUrl` TEXT NOT NULL,
    `liveShoppingId` INTEGER NOT NULL,

    UNIQUE INDEX `LiveShoppingExternalGoods_liveShoppingId_key`(`liveShoppingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShoppingExternalGoods` ADD CONSTRAINT `LiveShoppingExternalGoods_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
