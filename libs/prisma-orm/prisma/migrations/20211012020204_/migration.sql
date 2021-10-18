-- AlterTable
ALTER TABLE `GoodsConfirmation` MODIFY `status` ENUM('waiting', 'confirmed', 'rejected', 'needReconfirmation') NOT NULL DEFAULT 'waiting';
