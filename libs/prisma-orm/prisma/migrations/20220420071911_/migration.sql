/*
  Warnings:

  - You are about to drop the column `reason` on the `ConfirmHistory` table. All the data in the column will be lost.
  - You are about to alter the column `gender` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("Customer_gender")`.
  - You are about to drop the column `informationNoticeId` on the `Goods` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[goodsId]` on the table `GoodsInformationNotice` will be added. If there are existing duplicate values, this will fail.
  - Made the column `goodsId` on table `GoodsInformationNotice` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Goods` DROP FOREIGN KEY `Goods_informationNoticeId_fkey`;

-- AlterTable
ALTER TABLE `ConfirmHistory` DROP COLUMN `reason`;

-- AlterTable
ALTER TABLE `Customer` MODIFY `gender` ENUM('male', 'female', 'unknown') NULL DEFAULT 'unknown';

-- AlterTable
ALTER TABLE `Goods` DROP COLUMN `informationNoticeId`;

-- AlterTable
ALTER TABLE `GoodsInformationNotice` MODIFY `goodsId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `PrivacyApproachHistory` ADD COLUMN `reason` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `GoodsInformationNotice_goodsId_key` ON `GoodsInformationNotice`(`goodsId`);

-- AddForeignKey
ALTER TABLE `GoodsInformationNotice` ADD CONSTRAINT `GoodsInformationNotice_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
