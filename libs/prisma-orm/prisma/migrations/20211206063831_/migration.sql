-- AlterTable
ALTER TABLE `LiveShopping` ADD COLUMN `desiredCommission` DECIMAL(10, 2) NULL DEFAULT 0,
    ADD COLUMN `desiredPeriod` VARCHAR(191) NULL DEFAULT '무관';
