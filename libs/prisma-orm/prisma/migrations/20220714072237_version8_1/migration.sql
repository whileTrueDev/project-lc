/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `GoodsCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `GoodsCategory_name_key` ON `GoodsCategory`(`name`);
