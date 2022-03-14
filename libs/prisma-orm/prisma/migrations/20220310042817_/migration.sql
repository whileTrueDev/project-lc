-- DropForeignKey
ALTER TABLE `InactiveSellerBusinessRegistration` DROP FOREIGN KEY `InactiveSellerBusinessRegistration_sellerEmail_sellerId_fkey`;

-- DropForeignKey
ALTER TABLE `InactiveSellerSettlementAccount` DROP FOREIGN KEY `InactiveSellerSettlementAccount_sellerEmail_sellerId_fkey`;

-- AddForeignKey
ALTER TABLE `InactiveSellerBusinessRegistration` ADD CONSTRAINT `InactiveSellerBusinessRegistration_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `InactiveSeller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactiveSellerSettlementAccount` ADD CONSTRAINT `InactiveSellerSettlementAccount_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `InactiveSeller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
