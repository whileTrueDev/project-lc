-- AlterTable
ALTER TABLE `CartItemOption` ADD COLUMN `goodsOptionsId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `CartItemOption` ADD CONSTRAINT `CartItemOption_goodsOptionsId_fkey` FOREIGN KEY (`goodsOptionsId`) REFERENCES `GoodsOptions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
