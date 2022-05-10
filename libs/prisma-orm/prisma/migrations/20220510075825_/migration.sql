/*
  Warnings:

  - You are about to drop the column `requestDate` on the `Refund` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Refund` table. All the data in the column will be lost.
  - You are about to drop the column `totalRefundAmount` on the `Refund` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `RefundItem` table. All the data in the column will be lost.
  - Added the required column `refundAmount` to the `Refund` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GoodsInquiry` MODIFY `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `GoodsInquiryComment` MODIFY `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Refund` DROP COLUMN `requestDate`,
    DROP COLUMN `status`,
    DROP COLUMN `totalRefundAmount`,
    ADD COLUMN `memo` VARCHAR(191) NULL,
    ADD COLUMN `refundAmount` INTEGER NOT NULL,
    ADD COLUMN `refundBank` VARCHAR(191) NULL,
    MODIFY `completeDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `responsibility` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `RefundItem` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `Return` ADD COLUMN `refundId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Return` ADD CONSTRAINT `Return_refundId_fkey` FOREIGN KEY (`refundId`) REFERENCES `Refund`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
