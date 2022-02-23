/*
  Warnings:

  - You are about to drop the column `broadcasterSettlementInfoConfirmationId` on the `InactiveBroadcasterSettlementInfo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `InactiveBroadcasterSettlementInfo` DROP FOREIGN KEY `InactiveBroadcasterSettlementInfo_broadcasterSettlementInfo_fkey`;

-- AlterTable
ALTER TABLE `InactiveBroadcasterSettlementInfo` DROP COLUMN `broadcasterSettlementInfoConfirmationId`;

-- CreateTable
CREATE TABLE `InactiveBroadcasterSettlementInfoConfirmation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('waiting', 'confirmed', 'rejected') NOT NULL DEFAULT 'waiting',
    `rejectionReason` TEXT NULL,
    `settlementInfoId` INTEGER NOT NULL,

    UNIQUE INDEX `InactiveBroadcasterSettlementInfoConfirmation_settlementInfo_key`(`settlementInfoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InactiveBroadcasterSettlementInfoConfirmation` ADD CONSTRAINT `InactiveBroadcasterSettlementInfoConfirmation_settlementInf_fkey` FOREIGN KEY (`settlementInfoId`) REFERENCES `InactiveBroadcasterSettlementInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
