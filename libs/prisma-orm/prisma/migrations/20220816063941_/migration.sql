-- DropForeignKey
ALTER TABLE `LiveShoppingMessageSetting` DROP FOREIGN KEY `LiveShoppingMessageSetting_liveShoppingId_fkey`;

-- DropIndex
DROP INDEX `KkshowSubNavLink_name_key` ON `KkshowSubNavLink`;

-- AlterTable
ALTER TABLE `LiveShoppingMessageSetting` MODIFY `fanNick` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `OrderItemOption` ADD COLUMN `liveShoppingSpecialPriceId` INTEGER NULL;

-- CreateTable
CREATE TABLE `LiveShoppingSpecialPrice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `specialPrice` DECIMAL(10, 2) NOT NULL,
    `goodsId` INTEGER NOT NULL,
    `goodsOptionId` INTEGER NOT NULL,
    `liveShoppingId` INTEGER NOT NULL,
    `discountType` ENUM('P', 'W') NOT NULL DEFAULT 'W',
    `discountRate` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LiveShoppingMessageSetting` ADD CONSTRAINT `LiveShoppingMessageSetting_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShoppingSpecialPrice` ADD CONSTRAINT `LiveShoppingSpecialPrice_goodsOptionId_fkey` FOREIGN KEY (`goodsOptionId`) REFERENCES `GoodsOptions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShoppingSpecialPrice` ADD CONSTRAINT `LiveShoppingSpecialPrice_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItemOption` ADD CONSTRAINT `OrderItemOption_liveShoppingSpecialPriceId_fkey` FOREIGN KEY (`liveShoppingSpecialPriceId`) REFERENCES `LiveShoppingSpecialPrice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
