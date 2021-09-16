/*
  Warnings:

  - A unique constraint covering the columns `[goodsOptionsId]` on the table `GoodsOptionsSupplies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `GoodsOptionsSupplies_goodsOptionsId_unique` ON `GoodsOptionsSupplies`(`goodsOptionsId`);
