-- CreateTable
CREATE TABLE `SellerSettlementConfirmHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
    `type` ENUM('settlementAccount', 'businessRegistration', 'mailOrder') NOT NULL,
    `status` ENUM('waiting', 'confirmed', 'rejected') NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SellerSettlementConfirmHistory` ADD CONSTRAINT `SellerSettlementConfirmHistory_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE `PrivacyApproachHistory` ADD COLUMN `reason` VARCHAR(191) NULL;
