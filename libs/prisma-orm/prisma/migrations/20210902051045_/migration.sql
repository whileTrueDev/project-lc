-- CreateTable
CREATE TABLE `SellerBusinessRegistration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerEmail` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `businessRegistrationNumber` VARCHAR(191) NOT NULL,
    `representativeName` VARCHAR(191) NOT NULL,
    `businessType` VARCHAR(191) NOT NULL,
    `businessItem` VARCHAR(191) NOT NULL,
    `businessAddress` VARCHAR(191) NOT NULL,
    `taxInvoiceMail` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,

    INDEX `BusinessRegistrationIndex`(`sellerEmail`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SellerBusinessRegistration` ADD FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerBusinessRegistration` ADD FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
