/*
  Warnings:

  - You are about to drop the column `reason` on the `ConfirmHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ConfirmHistory` DROP COLUMN `reason`;

-- AlterTable
ALTER TABLE `PrivacyApproachHistory` ADD COLUMN `reason` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `CartItemOption` ADD COLUMN `goodsOptionsId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `CartItemOption` ADD CONSTRAINT `CartItemOption_goodsOptionsId_fkey` FOREIGN KEY (`goodsOptionsId`) REFERENCES `GoodsOptions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
