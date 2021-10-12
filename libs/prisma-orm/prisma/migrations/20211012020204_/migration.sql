-- AlterTable
ALTER TABLE `GoodsConfirmation` MODIFY `status` ENUM('waiting', 'confirmed', 'rejected', 'needReconfirmation') NOT NULL DEFAULT 'waiting';

-- RenameIndex
ALTER TABLE `GoodsOptionsSupplies` RENAME INDEX `GoodsOptionsSupplies_goodsOptionsId_unique` TO `GoodsOptionsSupplies_goodsOptionsId_key`;
