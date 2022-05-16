-- AlterTable
ALTER TABLE `Exchange` ADD COLUMN `memo` VARCHAR(191) NULL,
    MODIFY `returnAddress` VARCHAR(191) NULL,
    MODIFY `responsibility` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Return` ADD COLUMN `memo` VARCHAR(191) NULL,
    ADD COLUMN `returnBank` VARCHAR(191) NULL,
    ADD COLUMN `returnBankAccount` VARCHAR(191) NULL,
    MODIFY `returnAddress` VARCHAR(191) NULL,
    MODIFY `responsibility` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ReturnImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imageUrl` VARCHAR(191) NOT NULL,
    `returnId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExchangeImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imageUrl` VARCHAR(191) NOT NULL,
    `exchangeId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ReturnImage` ADD CONSTRAINT `ReturnImage_returnId_fkey` FOREIGN KEY (`returnId`) REFERENCES `Return`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExchangeImage` ADD CONSTRAINT `ExchangeImage_exchangeId_fkey` FOREIGN KEY (`exchangeId`) REFERENCES `Exchange`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE `Exchange` ADD COLUMN `recipientAddress` VARCHAR(191) NULL,
    ADD COLUMN `recipientDetailAddress` VARCHAR(191) NULL,
    ADD COLUMN `recipientPostalCode` VARCHAR(191) NULL,
    ADD COLUMN `recipientShippingMemo` VARCHAR(191) NULL;
