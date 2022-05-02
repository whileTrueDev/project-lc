-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `reviewId` INTEGER NULL;

-- AlterTable
ALTER TABLE `OrderItemOption` ADD COLUMN `purchaseConfirmationDate` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `GoodsReview`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
