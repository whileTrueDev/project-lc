-- DropForeignKey
ALTER TABLE `SellerBusinessRegistration` DROP FOREIGN KEY `SellerBusinessRegistration_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SellerBusinessRegistration` DROP FOREIGN KEY `SellerBusinessRegistration_ibfk_2`;

-- DropForeignKey
ALTER TABLE `SellerSettlementAccount` DROP FOREIGN KEY `SellerSettlementAccount_ibfk_1`;

-- DropForeignKey
ALTER TABLE `SellerSettlements` DROP FOREIGN KEY `SellerSettlements_ibfk_1`;

-- AddForeignKey
ALTER TABLE `SellerBusinessRegistration` ADD FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlements` ADD FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementAccount` ADD FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
