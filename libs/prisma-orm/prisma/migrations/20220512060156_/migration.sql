-- AlterTable
ALTER TABLE `CustomerCouponLog` ADD COLUMN `orderId` INTEGER NULL;

-- AlterTable
ALTER TABLE `GoodsInquiry` MODIFY `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `GoodsInquiryComment` MODIFY `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `CustomerCouponLog` ADD CONSTRAINT `CustomerCouponLog_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
