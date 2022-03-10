-- DropForeignKey
ALTER TABLE `InactiveSellerBusinessRegistration` DROP FOREIGN KEY `InactiveSellerBusinessRegistration_sellerEmail_sellerId_fkey`;

-- DropForeignKey
ALTER TABLE `InactiveSellerSettlementAccount` DROP FOREIGN KEY `InactiveSellerSettlementAccount_sellerEmail_sellerId_fkey`;

-- DropForeignKey
ALTER TABLE `SellerBusinessRegistration` DROP FOREIGN KEY `SellerBusinessRegistration_sellerEmail_sellerId_fkey`;

-- DropForeignKey
ALTER TABLE `SellerSettlementAccount` DROP FOREIGN KEY `SellerSettlementAccount_sellerEmail_sellerId_fkey`;

-- DropForeignKey
ALTER TABLE `SellerSettlements` DROP FOREIGN KEY `SellerSettlements_sellerEmail_sellerId_fkey`;

-- AddForeignKey
ALTER TABLE `SellerBusinessRegistration` ADD CONSTRAINT `SellerBusinessRegistration_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlements` ADD CONSTRAINT `SellerSettlements_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementAccount` ADD CONSTRAINT `SellerSettlementAccount_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactiveSellerBusinessRegistration` ADD CONSTRAINT `InactiveSellerBusinessRegistration_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `InactiveSeller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactiveSellerSettlementAccount` ADD CONSTRAINT `InactiveSellerSettlementAccount_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `InactiveSeller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
