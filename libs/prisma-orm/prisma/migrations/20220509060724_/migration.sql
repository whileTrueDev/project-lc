-- DropForeignKey
ALTER TABLE `CustomerCoupon` DROP FOREIGN KEY `CustomerCoupon_couponId_fkey`;

-- AlterTable
ALTER TABLE `GoodsInquiry` MODIFY `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `GoodsInquiryComment` MODIFY `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `CustomerCoupon` ADD CONSTRAINT `CustomerCoupon_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
