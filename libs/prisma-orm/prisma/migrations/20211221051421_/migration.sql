/*
  Warnings:

  - You are about to drop the `LiveCommerceRanking` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `LiveCommerceRanking` DROP FOREIGN KEY `LiveCommerceRanking_broadcasterEmail_fkey`;

-- DropTable
DROP TABLE `LiveCommerceRanking`;

-- CreateTable
CREATE TABLE `LiveShoppingPurchaseMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(191) NOT NULL DEFAULT '비회원',
    `text` LONGTEXT NOT NULL,
    `price` INTEGER NOT NULL,
    `phoneCallEventFlag` BOOLEAN NOT NULL DEFAULT false,
    `giftFlag` BOOLEAN NOT NULL DEFAULT false,
    `loginFlag` BOOLEAN NOT NULL DEFAULT true,
    `broadcasterEmail` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `liveShoppingId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LiveShoppingPurchaseMessage` ADD CONSTRAINT `LiveShoppingPurchaseMessage_broadcasterEmail_fkey` FOREIGN KEY (`broadcasterEmail`) REFERENCES `Broadcaster`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShoppingPurchaseMessage` ADD CONSTRAINT `LiveShoppingPurchaseMessage_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
