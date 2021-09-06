-- DropForeignKey
ALTER TABLE `LoginHistory` DROP FOREIGN KEY `LoginHistory_ibfk_1`;

-- AlterTable
ALTER TABLE `LoginHistory` MODIFY `country` VARCHAR(191);

-- AddForeignKey
ALTER TABLE `LoginHistory` ADD FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
