-- DropForeignKey
ALTER TABLE `CustomerCoupon` DROP FOREIGN KEY `CustomerCoupon_couponId_fkey`;

-- AddForeignKey
ALTER TABLE `CustomerCoupon` ADD CONSTRAINT `CustomerCoupon_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
