/*
  Warnings:

  - A unique constraint covering the columns `[fmGoodsSeq]` on the table `LiveShopping` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `LiveShopping` ADD COLUMN `fmGoodsSeq` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `LiveShopping_fmGoodsSeq_key` ON `LiveShopping`(`fmGoodsSeq`);
