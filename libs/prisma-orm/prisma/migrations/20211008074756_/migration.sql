-- AlterTable
ALTER TABLE `LiveCommerceRanking` MODIFY `nickname` VARCHAR(191) NOT NULL DEFAULT '비회원';

-- CreateTable
CREATE TABLE `BusinessRegistrationConfirmation` (
    `id` INTEGER NOT NULL,
    `status` ENUM('waiting', 'confirmed', 'rejected') NOT NULL DEFAULT 'waiting',
    `rejectionReason` TEXT,
    `SellerBusinessRegistrationId` INTEGER NOT NULL,

    UNIQUE INDEX `BusinessRegistrationConfirmation_SellerBusinessRegistrationI_key`(`SellerBusinessRegistrationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BusinessRegistrationConfirmation` ADD CONSTRAINT `BusinessRegistrationConfirmation_SellerBusinessRegistration_fkey` FOREIGN KEY (`SellerBusinessRegistrationId`) REFERENCES `SellerBusinessRegistration`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Goods` RENAME INDEX `Goods_goodsInfoId_unique` TO `Goods_goodsInfoId_key`;

-- RenameIndex
ALTER TABLE `GoodsOptionsSupplies` RENAME INDEX `GoodsOptionsSupplies_goodsOptionsId_unique` TO `GoodsOptionsSupplies_goodsOptionsId_key`;
