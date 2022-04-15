-- CreateTable
CREATE TABLE `ConfirmHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerBusinessRegistrationId` INTEGER NULL,
    `sellerSettlementAccountId` INTEGER NULL,
    `broadcasterSettlementInfoId` INTEGER NULL,
    `type` ENUM('settlementAccount', 'businessRegistration', 'mailOrder') NOT NULL,
    `reason` VARCHAR(191) NULL,
    `status` ENUM('waiting', 'confirmed', 'rejected') NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ConfirmHistory` ADD CONSTRAINT `ConfirmHistory_sellerBusinessRegistrationId_fkey` FOREIGN KEY (`sellerBusinessRegistrationId`) REFERENCES `SellerBusinessRegistration`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfirmHistory` ADD CONSTRAINT `ConfirmHistory_sellerSettlementAccountId_fkey` FOREIGN KEY (`sellerSettlementAccountId`) REFERENCES `SellerSettlementAccount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfirmHistory` ADD CONSTRAINT `ConfirmHistory_broadcasterSettlementInfoId_fkey` FOREIGN KEY (`broadcasterSettlementInfoId`) REFERENCES `BroadcasterSettlementInfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
