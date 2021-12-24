/*
Warnings:

- You are about to drop the column `afreecaId` on the `Broadcaster` table. All the data in the column will be lost.
- You are about to drop the column `channelUrl` on the `Broadcaster` table. All the data in the column will be lost.
- You are about to drop the column `twitchId` on the `Broadcaster` table. All the data in the column will be lost.
- You are about to drop the column `userId` on the `Broadcaster` table. All the data in the column will be lost.
- You are about to drop the column `youtubeId` on the `Broadcaster` table. All the data in the column will be lost.
- You are about to drop the column `streamId` on the `LiveShopping` table. All the data in the column will be lost.
- You are about to alter the column `broadcasterId` on the `LiveShopping` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Int`.
- You are about to drop the column `sellerId` on the `LoginHistory` table. All the data in the column will be lost.
- You are about to drop the `LiveCommerceRanking` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `LiveCommerceRanking` DROP FOREIGN KEY `LiveCommerceRanking_broadcasterId_fkey`;

-- DropForeignKey
ALTER TABLE `LiveShopping` DROP FOREIGN KEY `LiveShopping_broadcasterId_fkey`;

-- DropForeignKey
ALTER TABLE `LoginHistory` DROP FOREIGN KEY `LoginHistory_sellerId_fkey`;

-- DropIndex
DROP INDEX `Broadcaster_userId_idx` ON `Broadcaster`;

-- DropIndex
DROP INDEX `LiveShopping_streamId_key` ON `LiveShopping`;

-- AlterTable
ALTER TABLE `Broadcaster` DROP COLUMN `afreecaId`,
    DROP COLUMN `channelUrl`,
    DROP COLUMN `twitchId`,
    DROP COLUMN `userId`,
    DROP COLUMN `youtubeId`,
    ADD COLUMN `agreementFlag` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NULL,
    MODIFY `userNickname` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `Seller` ADD COLUMN `avatar` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `LiveShopping` DROP COLUMN `streamId`,
    ADD COLUMN `desiredCommission` DECIMAL(10, 2) NULL DEFAULT 0,
    ADD COLUMN `desiredPeriod` VARCHAR(191) NULL DEFAULT '무관',
    ADD COLUMN `fmGoodsSeq` INTEGER NULL,
    MODIFY `broadcasterId` INTEGER NULL;

-- LiveShopping 테이블 초기화
DELETE FROM `LiveShopping`;

-- DropTable
DROP TABLE `LiveCommerceRanking`;

-- DropTable
DROP TABLE `LoginHistory`;

-- CreateTable
CREATE TABLE `LoginHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userEmail` VARCHAR(191) NOT NULL,
    `userType` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191),
    `city` VARCHAR(191),
    `device` VARCHAR(191) NOT NULL,
    `ua` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LoginHistory_userEmail_userType_idx`(`userEmail`, `userType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BroadcasterSocialAccount` (
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
CREATE TABLE `BroadcasterContacts` (
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
CREATE TABLE `BroadcasterAddress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(191) NOT NULL,
    `detailAddress` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `broadcasterId` INTEGER NULL,

    UNIQUE INDEX `BroadcasterAddress_broadcasterId_key`(`broadcasterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BroadcasterChannel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `broadcasterId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BroadcasterSettlements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `round` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `broadcasterId` INTEGER NOT NULL,

    UNIQUE INDEX `BroadcasterSettlements_broadcasterId_round_key`(`broadcasterId`, `round`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BroadcasterSettlementItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` VARCHAR(191) NOT NULL,
    `exportCode` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL DEFAULT 0,
    `liveShoppingId` INTEGER NULL,
    `broadcasterSettlementsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BroadcasterSettlementInfo` (
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

    UNIQUE INDEX `BroadcasterSettlementInfo_broadcasterId_key`(`broadcasterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BroadcasterSettlementInfoConfirmation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('waiting', 'confirmed', 'rejected') NOT NULL DEFAULT 'waiting',
    `rejectionReason` TEXT NULL,
    `settlementInfoId` INTEGER NOT NULL,

    UNIQUE INDEX `BroadcasterSettlementInfoConfirmation_settlementInfoId_key`(`settlementInfoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveShoppingPurchaseMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(191) NOT NULL DEFAULT '비회원',
    `text` LONGTEXT NOT NULL,
    `price` INTEGER NOT NULL,
    `phoneCallEventFlag` BOOLEAN NOT NULL DEFAULT false,
    `giftFlag` BOOLEAN NOT NULL DEFAULT false,
    `loginFlag` BOOLEAN NOT NULL DEFAULT true,
    `broadcasterEmail` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `liveShoppingId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserNotification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userEmail` VARCHAR(191) NOT NULL,
    `userType` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `readFlag` BOOLEAN NOT NULL DEFAULT false,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserNotification_userEmail_userType_idx`(`userEmail`, `userType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Administrator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Administrator_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inquiry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `brandName` VARCHAR(191) NULL,
    `homepage` VARCHAR(191) NULL,
    `type` ENUM('seller', 'broadcaster') NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `readFlag` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `LiveShopping_fmGoodsSeq_key` ON `LiveShopping`(`fmGoodsSeq`);

-- AddForeignKey
ALTER TABLE `BroadcasterSocialAccount` ADD CONSTRAINT `BroadcasterSocialAccount_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterContacts` ADD CONSTRAINT `BroadcasterContacts_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterAddress` ADD CONSTRAINT `BroadcasterAddress_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterChannel` ADD CONSTRAINT `BroadcasterChannel_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterSettlements` ADD CONSTRAINT `BroadcasterSettlements_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterSettlementItems` ADD CONSTRAINT `BroadcasterSettlementItems_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterSettlementItems` ADD CONSTRAINT `BroadcasterSettlementItems_broadcasterSettlementsId_fkey` FOREIGN KEY (`broadcasterSettlementsId`) REFERENCES `BroadcasterSettlements`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterSettlementInfo` ADD CONSTRAINT `BroadcasterSettlementInfo_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterSettlementInfoConfirmation` ADD CONSTRAINT `BroadcasterSettlementInfoConfirmation_settlementInfoId_fkey` FOREIGN KEY (`settlementInfoId`) REFERENCES `BroadcasterSettlementInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShopping` ADD CONSTRAINT `LiveShopping_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShoppingPurchaseMessage` ADD CONSTRAINT `LiveShoppingPurchaseMessage_broadcasterEmail_fkey` FOREIGN KEY (`broadcasterEmail`) REFERENCES `Broadcaster`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveShoppingPurchaseMessage` ADD CONSTRAINT `LiveShoppingPurchaseMessage_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
