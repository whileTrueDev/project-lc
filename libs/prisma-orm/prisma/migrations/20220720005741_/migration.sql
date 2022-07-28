
-- AlterTable
ALTER TABLE `ExchangeItem` RENAME COLUMN `amount` TO `quantity`;

-- AlterTable
ALTER TABLE `ExportItem` RENAME COLUMN `amount` TO `quantity`;

-- AlterTable
ALTER TABLE `OrderCancellationItem` RENAME COLUMN `amount` TO `quantity`;

-- AlterTable
ALTER TABLE `RefundItem` RENAME COLUMN `amount` TO `quantity`;

-- AlterTable
ALTER TABLE `ReturnItem` RENAME COLUMN `amount` TO `quantity`;

-- AlterTable
ALTER TABLE `SellerOrderCancelRequestItem` RENAME COLUMN `amount` TO `quantity`;


-- AlterTable
ALTER TABLE `GoodsCategory` ADD COLUMN `imageSrc` LONGTEXT NULL;

-- CreateTable
CREATE TABLE `KkshowShoppingTabCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `goodsCategoryCode` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `KkshowShoppingTabCategory_goodsCategoryCode_key`(`goodsCategoryCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `KkshowShoppingTabCategory` ADD CONSTRAINT `KkshowShoppingTabCategory_goodsCategoryCode_fkey` FOREIGN KEY (`goodsCategoryCode`) REFERENCES `GoodsCategory`(`categoryCode`) ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `KkshowSubNavLink` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `KkshowSubNavLink_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

/*
  Warnings:

  - You are about to alter the column `mileageStrategy` on the `MileageSetting` table. The data in that column could be lost. The data in that column will be cast from `Enum("MileageSetting_mileageStrategy")` to `Enum("MileageSetting_mileageStrategy")`.

*/
-- AlterTable
ALTER TABLE `MileageSetting` ADD COLUMN `useMileageFeature` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `mileageStrategy` ENUM('onPaymentPriceExceptMileageUsage', 'onPaymentPrice', 'onPaymentWithoutMileageUse') NOT NULL DEFAULT 'onPaymentWithoutMileageUse';


-- 전역 마일리지 설정 초기값 저장(마일리지 적립기능 사용안함으로 설정해둠)
INSERT INTO `MileageSetting` (`id`, `defaultMileagePercent`, `mileageStrategy`, `useMileageFeature`)
VALUES
	(1, 1, 'onPaymentWithoutMileageUse', 0);


-- 최초 카테고리 이미지 데이터 추가
UPDATE `GoodsCategory` SET `imageSrc` = "https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/goods-category/8_ICTMpESlc4XXKBQdSE8/220721165004" WHERE `categoryCode` = "8_ICTMpESlc4XXKBQdSE8";
UPDATE `GoodsCategory` SET `imageSrc` = "https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/goods-category/Y0UhII4ELTwhdi5Fkw6c2/220721165016" WHERE `categoryCode` = "Y0UhII4ELTwhdi5Fkw6c2";
UPDATE `GoodsCategory` SET `imageSrc` = "https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/goods-category/VP07hyfPH0ZwVINGG_94b/220721165109" WHERE `categoryCode` = "VP07hyfPH0ZwVINGG_94b";
UPDATE `GoodsCategory` SET `imageSrc` = "https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/goods-category/기타/220721165216" WHERE `categoryCode` = "기타";
UPDATE `GoodsCategory` SET `imageSrc` = "https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/goods-category/3OODwX2OsE8nUeu79ca59/220721142751_간편식/밀키트" WHERE `categoryCode` = "3OODwX2OsE8nUeu79ca59";
UPDATE `GoodsCategory` SET `imageSrc` = "https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/goods-category/oIA7PeZ4M6nrjVHgdSSYs/220721165836" WHERE `categoryCode` = "oIA7PeZ4M6nrjVHgdSSYs";
UPDATE `GoodsCategory` SET `imageSrc` = 'https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/goods-category/ODmmbG17fkpWBvJS44cDz/220721165903' WHERE `categoryCode` = "ODmmbG17fkpWBvJS44cDz";
UPDATE `GoodsCategory` SET `imageSrc` = 'https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/goods-category/_IGJGLoiep3kDtAXR5sez/220721165947' WHERE `categoryCode` = "_IGJGLoiep3kDtAXR5sez";
UPDATE `GoodsCategory` SET `imageSrc` = 'https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/goods-category/b-0sqerAdOBJ464uNH2R4/220721165930' WHERE `categoryCode` = "b-0sqerAdOBJ464uNH2R4";
UPDATE `GoodsCategory` SET `imageSrc` = 'https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/goods-category/cablIPmpwaBiyKfCKDd_L/220721165917' WHERE `categoryCode` = "cablIPmpwaBiyKfCKDd_L";

-- 최초 크크마켓 카테고리 목록 데이터 추가
INSERT INTO KkshowShoppingTabCategory (goodsCategoryCode)
VALUES
    ("8_ICTMpESlc4XXKBQdSE8"),
    ("Y0UhII4ELTwhdi5Fkw6c2"),
    ("VP07hyfPH0ZwVINGG_94b"),
    ("기타"),
    ("3OODwX2OsE8nUeu79ca59"),
    ("oIA7PeZ4M6nrjVHgdSSYs"),
    ("ODmmbG17fkpWBvJS44cDz"),
    ("_IGJGLoiep3kDtAXR5sez"),
    ("b-0sqerAdOBJ464uNH2R4"),
    ("cablIPmpwaBiyKfCKDd_L");