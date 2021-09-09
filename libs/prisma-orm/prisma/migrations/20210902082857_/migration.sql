-- CreateTable
CREATE TABLE `SellerSettlements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerEmail` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `state` TINYINT UNSIGNED NOT NULL DEFAULT 0,

    INDEX `SellerSettlementsIndex`(`sellerEmail`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellerSettlementAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerEmail` VARCHAR(191) NOT NULL,
    `bank` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    INDEX `SellerSettlementAccountIndex`(`sellerEmail`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SellerSettlements` ADD FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementAccount` ADD FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
