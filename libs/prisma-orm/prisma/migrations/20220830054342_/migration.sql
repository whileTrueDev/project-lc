-- AlterTable
ALTER TABLE `Notice` ADD COLUMN `target` ENUM('all', 'seller', 'broadcaster', 'customer') NOT NULL DEFAULT 'all';
