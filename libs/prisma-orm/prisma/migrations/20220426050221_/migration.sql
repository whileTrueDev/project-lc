-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `reviewId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `GoodsReview`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
