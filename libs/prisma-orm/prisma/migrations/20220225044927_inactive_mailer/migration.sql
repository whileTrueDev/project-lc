/*
  Warnings:

  - You are about to drop the column `sellerEmail` on the `SellerShop` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sellerId]` on the table `SellerShop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sellerId` to the `SellerBusinessRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `SellerSettlementAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `SellerSettlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `SellerShop` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `LiveShopping` DROP FOREIGN KEY `LiveShopping_contactId_fkey`;

-- SellerBusinessRegistration
ALTER TABLE `SellerBusinessRegistration` ADD `sellerId` INTEGER;

UPDATE `SellerBusinessRegistration`
INNER JOIN `Seller`
  ON `SellerBusinessRegistration`.`sellerEmail` = `Seller`.`email`
SET `SellerBusinessRegistration`.`sellerId` = `Seller`.`id`;

ALTER TABLE `SellerBusinessRegistration` MODIFY COLUMN `sellerId` INTEGER NOT NULL;

ALTER TABLE `SellerBusinessRegistration` ADD CONSTRAINT `SellerBusinessRegistration_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SellerBusinessRegistration` DROP FOREIGN KEY `SellerBusinessRegistration_sellerEmail_fkey`;

-- SellerSettlementAccount
ALTER TABLE `SellerSettlementAccount` ADD `sellerId` INTEGER;

UPDATE `SellerSettlementAccount`
INNER JOIN `Seller`
  ON `SellerSettlementAccount`.`sellerEmail` = `Seller`.`email`
SET `SellerSettlementAccount`.`sellerId` = `Seller`.`id`;

ALTER TABLE `SellerSettlementAccount` MODIFY COLUMN `sellerId` INTEGER NOT NULL;

ALTER TABLE `SellerSettlementAccount` ADD CONSTRAINT `SellerSettlementAccount_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SellerSettlementAccount` DROP FOREIGN KEY `SellerSettlementAccount_sellerEmail_fkey`;

-- SellerSettlementAccount
ALTER TABLE `SellerSettlements` ADD `sellerId` INTEGER;

UPDATE `SellerSettlements`
INNER JOIN `Seller`
  ON `SellerSettlements`.`sellerEmail` = `Seller`.`email`
SET `SellerSettlements`.`sellerId` = `Seller`.`id`;

ALTER TABLE `SellerSettlements` MODIFY COLUMN `sellerId` INTEGER NOT NULL;

ALTER TABLE `SellerSettlements` ADD CONSTRAINT `SellerSettlements_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SellerSettlements` DROP FOREIGN KEY `SellerSettlements_sellerEmail_fkey`;

-- SellerShop
ALTER TABLE `SellerShop` ADD `sellerId` INTEGER;

UPDATE `SellerShop`
INNER JOIN `Seller`
  ON `SellerShop`.`sellerEmail` = `Seller`.`email`
SET `SellerShop`.`sellerId` = `Seller`.`id`;

ALTER TABLE `SellerShop` MODIFY COLUMN `sellerId` INTEGER NOT NULL;

ALTER TABLE `SellerShop` ADD CONSTRAINT `SellerShop_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `SellerShop` DROP FOREIGN KEY `SellerShop_sellerEmail_fkey`;

ALTER TABLE `SellerShop` DROP `sellerEmail`;

-- AlterTable
ALTER TABLE `Administrator` ADD COLUMN `inactiveFlag` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Broadcaster` ADD COLUMN `inactiveFlag` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `userName` VARCHAR(20) NULL,
    MODIFY `overlayUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `LiveShopping` MODIFY `contactId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Seller` ADD COLUMN `inactiveFlag` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `email` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `InactiveBroadcaster` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NULL,
    `userName` VARCHAR(20) NULL,
    `userNickname` VARCHAR(20) NULL,
    `overlayUrl` VARCHAR(191) NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `password` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `inactiveFlag` BOOLEAN NOT NULL DEFAULT true,
    `deleteFlag` BOOLEAN NOT NULL,
    `agreementFlag` BOOLEAN NOT NULL,

    UNIQUE INDEX `InactiveBroadcaster_email_key`(`email`),
    UNIQUE INDEX `InactiveBroadcaster_overlayUrl_key`(`overlayUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InactiveSeller` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `inactiveFlag` BOOLEAN NOT NULL DEFAULT true,
    `agreementFlag` BOOLEAN NOT NULL,

    UNIQUE INDEX `InactiveSeller_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InactiveBroadcasterSocialAccount` (
    `serviceId` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `registDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `profileImage` VARCHAR(191) NULL,
    `accessToken` VARCHAR(191) NULL,
    `refreshToken` VARCHAR(191) NULL,
    `broadcasterId` INTEGER NOT NULL,

    INDEX `broadcasterId`(`broadcasterId`),
    PRIMARY KEY (`serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InactiveSellerSocialAccount` (
    `serviceId` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `registDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `profileImage` VARCHAR(191) NULL,
    `accessToken` VARCHAR(191) NULL,
    `refreshToken` VARCHAR(191) NULL,
    `sellerId` INTEGER NOT NULL,

    INDEX `sellerId`(`sellerId`),
    PRIMARY KEY (`serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InactiveBroadcasterAddress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(191) NOT NULL,
    `detailAddress` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `broadcasterId` INTEGER NULL,

    UNIQUE INDEX `InactiveBroadcasterAddress_broadcasterId_key`(`broadcasterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InactiveBroadcasterChannel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `broadcasterId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InactiveBroadcasterContacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `phoneNumber` VARCHAR(191) NOT NULL DEFAULT '',
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `broadcasterId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InactiveBroadcasterSettlementInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('naturalPerson', 'selfEmployedBusiness') NOT NULL DEFAULT 'naturalPerson',
    `name` VARCHAR(191) NOT NULL,
    `idCardNumber` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `bank` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `accountHolder` VARCHAR(191) NOT NULL,
    `idCardImageName` VARCHAR(191) NOT NULL,
    `accountImageName` VARCHAR(191) NOT NULL,
    `taxManageAgreement` BOOLEAN NOT NULL DEFAULT false,
    `personalInfoAgreement` BOOLEAN NOT NULL DEFAULT false,
    `settlementAgreement` BOOLEAN NULL,
    `broadcasterId` INTEGER NOT NULL,

    UNIQUE INDEX `InactiveBroadcasterSettlementInfo_broadcasterId_key`(`broadcasterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InactiveBroadcasterSettlementInfoConfirmation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('waiting', 'confirmed', 'rejected') NOT NULL DEFAULT 'waiting',
    `rejectionReason` TEXT NULL,
    `settlementInfoId` INTEGER NOT NULL,

    UNIQUE INDEX `InactiveBroadcasterSettlementInfoConfirmation_settlementInfo_key`(`settlementInfoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InactiveSellerBusinessRegistration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
    `sellerEmail` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `businessRegistrationNumber` VARCHAR(191) NOT NULL,
    `representativeName` VARCHAR(191) NOT NULL,
    `businessType` VARCHAR(191) NOT NULL,
    `businessItem` VARCHAR(191) NOT NULL,
    `businessAddress` VARCHAR(191) NOT NULL,
    `taxInvoiceMail` VARCHAR(191) NOT NULL,
    `businessRegistrationImageName` VARCHAR(191) NOT NULL,
    `mailOrderSalesNumber` VARCHAR(191) NOT NULL,
    `mailOrderSalesImageName` VARCHAR(191) NOT NULL,

    INDEX `BusinessRegistrationIndex`(`sellerEmail`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InactiveSellerContacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `phoneNumber` VARCHAR(191) NOT NULL DEFAULT '',
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InactiveSellerSettlementAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
    `sellerEmail` VARCHAR(191) NOT NULL,
    `bank` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `settlementAccountImageName` VARCHAR(191) NOT NULL,

    INDEX `SellerSettlementAccountIndex`(`sellerEmail`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InactiveBusinessRegistrationConfirmation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('waiting', 'confirmed', 'rejected') NOT NULL DEFAULT 'waiting',
    `rejectionReason` TEXT NULL,
    `InactiveSellerBusinessRegistrationId` INTEGER NOT NULL,

    UNIQUE INDEX `InactiveBusinessRegistrationConfirmation_InactiveSellerBusin_key`(`InactiveSellerBusinessRegistrationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `SellerShop_sellerId_key` ON `SellerShop`(`sellerId`);

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `SellerContacts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactiveBroadcasterSocialAccount` ADD CONSTRAINT `InactiveBroadcasterSocialAccount_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `InactiveBroadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactiveSellerSocialAccount` ADD CONSTRAINT `InactiveSellerSocialAccount_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `InactiveSeller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactiveBroadcasterAddress` ADD CONSTRAINT `InactiveBroadcasterAddress_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `InactiveBroadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactiveBroadcasterChannel` ADD CONSTRAINT `InactiveBroadcasterChannel_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `InactiveBroadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactiveBroadcasterContacts` ADD CONSTRAINT `InactiveBroadcasterContacts_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `InactiveBroadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactiveBroadcasterSettlementInfo` ADD CONSTRAINT `InactiveBroadcasterSettlementInfo_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `InactiveBroadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactiveBroadcasterSettlementInfoConfirmation` ADD CONSTRAINT `InactiveBroadcasterSettlementInfoConfirmation_settlementInf_fkey` FOREIGN KEY (`settlementInfoId`) REFERENCES `InactiveBroadcasterSettlementInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactiveSellerBusinessRegistration` ADD CONSTRAINT `InactiveSellerBusinessRegistration_sellerEmail_sellerId_fkey` FOREIGN KEY (`sellerEmail`, `sellerId`) REFERENCES `InactiveSeller`(`email`, `id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactiveSellerContacts` ADD CONSTRAINT `InactiveSellerContacts_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `InactiveSeller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactiveSellerSettlementAccount` ADD CONSTRAINT `InactiveSellerSettlementAccount_sellerEmail_sellerId_fkey` FOREIGN KEY (`sellerEmail`, `sellerId`) REFERENCES `InactiveSeller`(`email`, `id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactiveBusinessRegistrationConfirmation` ADD CONSTRAINT `InactiveBusinessRegistrationConfirmation_InactiveSellerBusi_fkey` FOREIGN KEY (`InactiveSellerBusinessRegistrationId`) REFERENCES `InactiveSellerBusinessRegistration`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
