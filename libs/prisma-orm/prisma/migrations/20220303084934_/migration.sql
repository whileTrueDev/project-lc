-- AlterTable
ALTER TABLE `Administrator` ADD COLUMN `adminClass` ENUM('super', 'full', 'normal') NOT NULL DEFAULT 'normal';

-- CreateTable
CREATE TABLE `PrivacyApproachHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminEmail` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `infoType` ENUM('broadcasterSettlementAccount', 'broadcasterIdCard', 'sellerSettlementAccount', 'sellerBusinessRegistration', 'sellerMailOrderCertificate') NOT NULL,
    `actionType` ENUM('download', 'view') NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminClassChangeHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminEmail` VARCHAR(191) NOT NULL,
    `targetEmail` VARCHAR(191) NOT NULL,
    `originalAdminClass` ENUM('super', 'full', 'normal') NOT NULL,
    `newAdminClass` ENUM('super', 'full', 'normal') NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

UPDATE `Administrator` SET `adminClass`='super' WHERE `email`='alsrhks1994@naver.com';

INSERT INTO `AdminClassChangeHistory`(`adminEmail`,`targetEmail`,`originalAdminClass`,`newAdminClass`) VALUES ('alsrhks1994@naver.com', 'alsrhks1994@naver.com', 'normal', 'super');