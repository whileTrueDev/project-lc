/*
  Warnings:

  - You are about to drop the column `image` on the `Goods` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[goodsInfoId]` on the table `Goods` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Goods` DROP COLUMN `image`,
    ADD COLUMN `goodsInfoId` INTEGER;

-- CreateTable
CREATE TABLE `GoodsImages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `goodsId` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `cut_number` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
    `info_name` VARCHAR(191) NOT NULL,
    `info_value` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Goods_goodsInfoId_unique` ON `Goods`(`goodsInfoId`);

-- AddForeignKey
ALTER TABLE `Goods` ADD FOREIGN KEY (`goodsInfoId`) REFERENCES `GoodsInfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsImages` ADD FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsInfo` ADD FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
