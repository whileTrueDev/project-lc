/*
  Warnings:

  - A unique constraint covering the columns `[goodsInfoId]` on the table `Goods` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Goods_goodsInfoId_key` ON `Goods`(`goodsInfoId`);

-- RenameIndex
-- ALTER TABLE `GoodsOptionsSupplies` RENAME INDEX `GoodsOptionsSupplies_goodsOptionsId_key` TO `GoodsOptionsSupplies_goodsOptionsId_unique`;
