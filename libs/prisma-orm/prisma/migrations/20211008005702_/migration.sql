-- AlterTable
ALTER TABLE `GoodsConfirmation` ADD COLUMN `rejectionReason` TEXT;

-- CreateIndex
CREATE INDEX `firstmallGoodsConnectionId` ON `GoodsConfirmation`(`firstmallGoodsConnectionId`);
