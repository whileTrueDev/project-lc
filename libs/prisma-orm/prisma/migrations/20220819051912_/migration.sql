-- DropForeignKey
ALTER TABLE `CustomerCoupon` DROP FOREIGN KEY `CustomerCoupon_customerId_fkey`;

-- AddForeignKey
ALTER TABLE `CustomerCoupon` ADD CONSTRAINT `CustomerCoupon_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
