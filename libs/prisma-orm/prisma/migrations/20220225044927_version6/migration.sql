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

ALTER TABLE `SellerBusinessRegistration` MODIFY COLUMN `sellerId` INTEGER NOT NULL AFTER `id`;

-- SellerSettlementAccount
ALTER TABLE `SellerSettlementAccount` ADD `sellerId` INTEGER;

UPDATE `SellerSettlementAccount`
INNER JOIN `Seller`
  ON `SellerSettlementAccount`.`sellerEmail` = `Seller`.`email`
SET `SellerSettlementAccount`.`sellerId` = `Seller`.`id`;

ALTER TABLE `SellerSettlementAccount` MODIFY COLUMN `sellerId` INTEGER NOT NULL;
ALTER TABLE `SellerSettlementAccount` ADD CONSTRAINT `SellerSettlementAccount_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `SellerSettlementAccount` DROP FOREIGN KEY `SellerSettlementAccount_sellerEmail_fkey`;
ALTER TABLE `SellerSettlementAccount` MODIFY COLUMN `sellerId` INTEGER NOT NULL AFTER `id`;

-- SellerSettlementAccount
ALTER TABLE `SellerSettlements` ADD `sellerId` INTEGER;

UPDATE `SellerSettlements`
INNER JOIN `Seller`
  ON `SellerSettlements`.`sellerEmail` = `Seller`.`email`
SET `SellerSettlements`.`sellerId` = `Seller`.`id`;

ALTER TABLE `SellerSettlements` MODIFY COLUMN `sellerId` INTEGER NOT NULL;
ALTER TABLE `SellerSettlements` ADD CONSTRAINT `SellerSettlements_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `SellerSettlements` DROP FOREIGN KEY `SellerSettlements_sellerEmail_fkey`;
ALTER TABLE `SellerSettlements` MODIFY COLUMN `sellerId` INTEGER NOT NULL AFTER `id`;

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
ALTER TABLE `SellerShop` MODIFY COLUMN `sellerId` INTEGER NOT NULL FIRST;

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
ALTER TABLE `Seller`
    ADD COLUMN `inactiveFlag` BOOLEAN NOT NULL DEFAULT false,
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

-- CreateTable
CREATE TABLE `LiveShoppingImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageUrl` VARCHAR(191) NULL,
    `type` ENUM('carousel', 'trailer') NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `liveShoppingId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KkshowMain` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `carousel` JSON NOT NULL,
    `trailer` JSON NOT NULL,
    `bestLive` JSON NOT NULL,
    `bestBroadcaster` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LiveShoppingImage` ADD CONSTRAINT `LiveShoppingImage_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 초기 데이터 추가(20220307 @joni 입력)
INSERT INTO `KkshowMain` (`id`, `carousel`, `trailer`, `bestLive`, `bestBroadcaster`)
VALUES
	(1, '[{\"type\": \"simpleBanner\", \"linkUrl\": \"https://k-kmarket.com/goods/catalog?code=0012\", \"imageUrl\": \"https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/kkshow-main-carousel-images/1646985653016_배너이미지.jpeg\", \"description\": \"크크쇼 3월 기획전\"}, {\"type\": \"upcoming\", \"imageUrl\": \"https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/live-shopping-images/null/carousel/1646985708035_나무늘봉순홍보물.jpeg\", \"normalPrice\": 12300, \"liveShoppingId\": null, \"productLinkUrl\": \"https://smartstore.naver.com/mideun/products/4867304181\", \"discountedPrice\": 9900, \"productImageUrl\": \"https://shop-phinf.pstatic.net/20220208_193/1644309112479hUb9L_JPEG/45444896009789141_685505840.jpg?type=m510\", \"profileImageUrl\": \"https://static-cdn.jtvnw.net/jtv_user_pictures/5f179460-761b-404e-afc6-9ec9ea26df1a-profile_image-70x70.png\", \"broadcastEndDate\": null, \"liveShoppingName\": \"봉순늘치킨데이\", \"broadcastStartDate\": null, \"broadcasterNickname\": \"\", \"liveShoppingProgress\": null, \"promotionPageLinkUrl\": \"\"}, {\"type\": \"nowPlaying\", \"platform\": \"twitch\", \"videoUrl\": \"chodan_\", \"normalPrice\": 39900, \"liveShoppingId\": null, \"productLinkUrl\": \"https://k-kmarket.com/goods/view?no=144\", \"discountedPrice\": 29900, \"productImageUrl\": \"https://k-kmarket.com/data/goods/1/2022/01/_temp_16418020129358view.jpg\", \"profileImageUrl\": \"https://static-cdn.jtvnw.net/jtv_user_pictures/2067380c-6c8f-4a4d-9f68-65c13572a59b-profile_image-70x70.png\", \"broadcastEndDate\": null, \"liveShoppingName\": \"해피쵸이어\", \"broadcastStartDate\": null, \"broadcasterNickname\": \"\", \"liveShoppingProgress\": null, \"promotionPageLinkUrl\": \"\"}, {\"type\": \"previous\", \"videoUrl\": \"vFv6ZUOEnAo\", \"normalPrice\": 20000, \"liveShoppingId\": null, \"productLinkUrl\": \"https://k-kmarket.com/goods/view?no=180\", \"discountedPrice\": 10000, \"productImageUrl\": \"https://k-kmarket.com/data/goods/1/2021/12/_temp_16385033431082large.png\", \"profileImageUrl\": \"https://static-cdn.jtvnw.net/jtv_user_pictures/a27144c9-0c62-46e4-a7a8-9b51b394567a-profile_image-70x70.png\", \"broadcastEndDate\": null, \"liveShoppingName\": \" 수련수련 x 크크쇼 라이브\", \"broadcastStartDate\": null, \"broadcasterNickname\": \"\", \"liveShoppingProgress\": null, \"promotionPageLinkUrl\": \"\"}, {\"type\": \"previous\", \"videoUrl\": \"TutKdpA-JRw\", \"normalPrice\": 20000, \"liveShoppingId\": null, \"productLinkUrl\": \"https://k-kmarket.com/goods/catalog?code=0012\", \"discountedPrice\": 10000, \"productImageUrl\": \"https://k-kmarket.com/data/goods/1/2022/02/_temp_16449174261446view.jpg\", \"profileImageUrl\": \"https://static-cdn.jtvnw.net/jtv_user_pictures/ec949373-7065-423c-afad-08f9504c8034-profile_image-150x150.png\", \"broadcastEndDate\": null, \"liveShoppingName\": \"연나비 x 크크쇼 라이브\", \"broadcastStartDate\": null, \"broadcasterNickname\": \"\", \"liveShoppingProgress\": null, \"promotionPageLinkUrl\": \"\"}]', '{\"imageUrl\": \"https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/live-shopping-images/undefined/trailer/1646985740614_민결희.jpeg\", \"normalPrice\": 19000, \"productLinkUrl\": \"https://k-kmarket.com/goods/view?no=181\", \"discountedPrice\": 14900, \"liveShoppingName\": \"민결희 x 예스닭강정\", \"broadcastStartDate\": \"2022-02-20T04:00:00.000Z\", \"broadcasterNickname\": \"민결희\", \"broadcasterDescription\": \"버츄얼,라방,트위치,유튜브\", \"broadcasterProfileImageUrl\": \"https://static-cdn.jtvnw.net/jtv_user_pictures/d156ff24-5b64-4ffa-83a8-1ecf0d1e71d2-profile_image-150x150.png\"}', '[{\"videoUrl\": \"4Bkuhi7i7Mk\", \"liveShoppingId\": null, \"profileImageUrl\": \"https://static-cdn.jtvnw.net/jtv_user_pictures/2067380c-6c8f-4a4d-9f68-65c13572a59b-profile_image-70x70.png\", \"liveShoppingTitle\": \"해피쵸이어\", \"liveShoppingDescription\": \"쵸단 x 귀빈정\", \"broadcasterProfileImageUrl\": \"\"}, {\"videoUrl\": \"3TLj00xYR-k\", \"liveShoppingId\": null, \"profileImageUrl\": \"https://static-cdn.jtvnw.net/jtv_user_pictures/45570b84-1206-4c6a-8d6c-d7700204b7b3-profile_image-150x150.png\", \"liveShoppingTitle\": \"메리크크쇼마스\", \"liveShoppingDescription\": \"나는야꼬등어 x 동래아들\", \"broadcasterProfileImageUrl\": \"\"}, {\"videoUrl\": \"TutKdpA-JRw\", \"liveShoppingId\": null, \"profileImageUrl\": \"https://static-cdn.jtvnw.net/jtv_user_pictures/ec949373-7065-423c-afad-08f9504c8034-profile_image-150x150.png\", \"liveShoppingTitle\": \"신맛의 오늘의 맛 \", \"liveShoppingDescription\": \"연나비 X 홍봉자굴림치즈만두\", \"broadcasterProfileImageUrl\": \"\"}, {\"videoUrl\": \"ISVt_Bu61vU\", \"liveShoppingId\": null, \"profileImageUrl\": \"https://static-cdn.jtvnw.net/jtv_user_pictures/24d7c181-ca61-4297-a276-ccc80a923b47-profile_image-150x150.png\", \"liveShoppingTitle\": \"토여니의 토요일은 즐거워!\", \"liveShoppingDescription\": \"유은 X 먹고집\", \"broadcasterProfileImageUrl\": \"\"}]', '[{\"nickname\": \"쵸단\", \"broadcasterId\": null, \"profileImageUrl\": \"https://static-cdn.jtvnw.net/jtv_user_pictures/2067380c-6c8f-4a4d-9f68-65c13572a59b-profile_image-150x150.png\", \"promotionPageLinkUrl\": \"https://k-kmarket.com/goods/catalog?code=00160001\"}, {\"nickname\": \"민결희\", \"broadcasterId\": null, \"profileImageUrl\": \"https://static-cdn.jtvnw.net/jtv_user_pictures/d156ff24-5b64-4ffa-83a8-1ecf0d1e71d2-profile_image-150x150.png\", \"promotionPageLinkUrl\": \"https://k-kmarket.com/goods/catalog?code=00160003\"}, {\"nickname\": \"나무늘봉순\", \"broadcasterId\": null, \"profileImageUrl\": \"https://static-cdn.jtvnw.net/jtv_user_pictures/5f179460-761b-404e-afc6-9ec9ea26df1a-profile_image-150x150.png\", \"promotionPageLinkUrl\": \"https://k-kmarket.com/goods/catalog?code=00160002\"}, {\"nickname\": \"신맛\", \"broadcasterId\": null, \"profileImageUrl\": \"https://static-cdn.jtvnw.net/jtv_user_pictures/f0c609d9-1a37-4896-9024-230488a283fe-profile_image-150x150.png\", \"promotionPageLinkUrl\": \"\"}, {\"nickname\": \"유은\", \"broadcasterId\": null, \"profileImageUrl\": \"https://static-cdn.jtvnw.net/jtv_user_pictures/24d7c181-ca61-4297-a276-ccc80a923b47-profile_image-150x150.png\", \"promotionPageLinkUrl\": \"\"}, {\"nickname\": \"수련수련\", \"broadcasterId\": null, \"profileImageUrl\": \"https://static-cdn.jtvnw.net/jtv_user_pictures/a27144c9-0c62-46e4-a7a8-9b51b394567a-profile_image-150x150.png\", \"promotionPageLinkUrl\": \"\"}]');

-- DropForeignKey
ALTER TABLE `InactiveSellerBusinessRegistration` DROP FOREIGN KEY `InactiveSellerBusinessRegistration_sellerEmail_sellerId_fkey`;

-- DropForeignKey
ALTER TABLE `InactiveSellerSettlementAccount` DROP FOREIGN KEY `InactiveSellerSettlementAccount_sellerEmail_sellerId_fkey`;

-- AddForeignKey
ALTER TABLE `InactiveSellerBusinessRegistration` ADD CONSTRAINT `InactiveSellerBusinessRegistration_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `InactiveSeller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InactiveSellerSettlementAccount` ADD CONSTRAINT `InactiveSellerSettlementAccount_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `InactiveSeller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


/*
  Warnings:

  - You are about to drop the column `sellerEmail` on the `InactiveSellerBusinessRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `sellerEmail` on the `InactiveSellerSettlementAccount` table. All the data in the column will be lost.
  - You are about to drop the column `sellerEmail` on the `SellerBusinessRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `sellerEmail` on the `SellerSettlementAccount` table. All the data in the column will be lost.
  - You are about to drop the column `sellerEmail` on the `SellerSettlements` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `BusinessRegistrationIndex` ON `InactiveSellerBusinessRegistration`;

-- DropIndex
DROP INDEX `InactiveSellerBusinessRegistration_sellerEmail_sellerId_fkey` ON `InactiveSellerBusinessRegistration`;

-- DropIndex
DROP INDEX `InactiveSellerSettlementAccount_sellerEmail_sellerId_fkey` ON `InactiveSellerSettlementAccount`;

-- DropIndex
DROP INDEX `SellerSettlementAccountIndex` ON `InactiveSellerSettlementAccount`;

-- DropIndex
DROP INDEX `BusinessRegistrationIndex` ON `SellerBusinessRegistration`;

-- DropIndex
DROP INDEX `SellerSettlementAccountIndex` ON `SellerSettlementAccount`;

-- DropIndex
DROP INDEX `SellerSettlementsIndex` ON `SellerSettlements`;

-- AlterTable
ALTER TABLE `InactiveSellerBusinessRegistration` DROP COLUMN `sellerEmail`;

-- AlterTable
ALTER TABLE `InactiveSellerSettlementAccount` DROP COLUMN `sellerEmail`;

-- AlterTable
ALTER TABLE `SellerBusinessRegistration` DROP COLUMN `sellerEmail`;

-- AlterTable
ALTER TABLE `SellerSettlementAccount` DROP COLUMN `sellerEmail`;

-- AlterTable
ALTER TABLE `SellerSettlements` DROP COLUMN `sellerEmail`;

-- CreateIndex
CREATE INDEX `BusinessRegistrationIndex` ON `InactiveSellerBusinessRegistration`(`id`);

-- CreateIndex
CREATE INDEX `SellerSettlementAccountIndex` ON `InactiveSellerSettlementAccount`(`id`);

-- CreateIndex
CREATE INDEX `BusinessRegistrationIndex` ON `SellerBusinessRegistration`(`id`);

-- CreateIndex
CREATE INDEX `SellerSettlementAccountIndex` ON `SellerSettlementAccount`(`id`);

-- CreateIndex
CREATE INDEX `SellerSettlementsIndex` ON `SellerSettlements`(`id`);
