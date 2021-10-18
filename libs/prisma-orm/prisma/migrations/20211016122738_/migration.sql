-- AlterTable
ALTER TABLE `LiveShopping` ADD COLUMN `endBroadcastDate` DATETIME(3),
    ADD COLUMN `rejectionReason` TEXT,
    ADD COLUMN `startBroadcastDate` DATETIME(3);
