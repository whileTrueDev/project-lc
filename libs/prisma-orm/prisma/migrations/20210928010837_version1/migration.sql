-- CreateTable
CREATE TABLE `Seller` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191),
    `password` VARCHAR(191),

    UNIQUE INDEX `Seller_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellerShop` (
    `sellerEmail` VARCHAR(191) NOT NULL,
    `shopName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SellerShop_sellerEmail_key`(`sellerEmail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `SellerSettlements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerEmail` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `state` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `amount` INTEGER NOT NULL DEFAULT 0,

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

-- CreateTable
CREATE TABLE `MailVerificationCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `verificationCode` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `email` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellerSocialAccount` (
    `serviceId` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `registDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `profileImage` VARCHAR(191),
    `accessToken` VARCHAR(191),
    `refreshToken` VARCHAR(191),
    `sellerId` INTEGER NOT NULL,

    INDEX `sellerId`(`sellerId`),
    PRIMARY KEY (`serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Goods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
    `goods_name` VARCHAR(191) NOT NULL,
    `summary` VARCHAR(191) NOT NULL,
    `goods_status` ENUM('normal', 'runout', 'purchasing', 'unsold') NOT NULL DEFAULT 'normal',
    `cancel_type` VARCHAR(191) NOT NULL DEFAULT '0',
    `contents` LONGTEXT,
    `contents_mobile` LONGTEXT,
    `shipping_policy` ENUM('shop', 'goods') NOT NULL DEFAULT 'shop',
    `goods_shipping_policy` ENUM('unlimit', 'limit') NOT NULL DEFAULT 'unlimit',
    `unlimit_shipping_price` INTEGER UNSIGNED,
    `limit_shipping_ea` TINYINT UNSIGNED,
    `limit_shipping_price` INTEGER UNSIGNED,
    `limit_shipping_subprice` TINYINT UNSIGNED,
    `shipping_weight_policy` ENUM('shop', 'goods') NOT NULL DEFAULT 'shop',
    `min_purchase_limit` ENUM('unlimit', 'limit') NOT NULL DEFAULT 'unlimit',
    `min_purchase_ea` MEDIUMINT UNSIGNED,
    `max_purchase_limit` ENUM('unlimit', 'limit') NOT NULL DEFAULT 'unlimit',
    `max_purchase_ea` MEDIUMINT UNSIGNED,
    `max_urchase_order_limit` MEDIUMINT UNSIGNED,
    `admin_memo` TEXT,
    `option_use` VARCHAR(191) NOT NULL DEFAULT '0',
    `option_view_type` ENUM('divide', 'join') NOT NULL DEFAULT 'divide',
    `option_suboption_use` VARCHAR(191) NOT NULL DEFAULT '0',
    `member_input_use` VARCHAR(191) NOT NULL DEFAULT '0',
    `goods_view` ENUM('look', 'notLook') NOT NULL DEFAULT 'look',
    `regist_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `runout_policy` ENUM('stock', 'ableStock', 'unlimited') DEFAULT 'unlimited',
    `shippingGroupId` INTEGER,
    `goodsInfoId` INTEGER,

    INDEX `sellerId`(`sellerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsConfirmation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `goodsId` INTEGER NOT NULL,
    `status` ENUM('waiting', 'confirmed', 'rejected') NOT NULL DEFAULT 'waiting',
    `firstmallGoodsConnectionId` INTEGER,

    UNIQUE INDEX `GoodsConfirmation_goodsId_key`(`goodsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsOptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `goodsId` INTEGER NOT NULL,
    `default_option` ENUM('y', 'n') NOT NULL DEFAULT 'n',
    `option_type` VARCHAR(191) NOT NULL DEFAULT 'direct',
    `option_title` VARCHAR(191),
    `option1` VARCHAR(191),
    `option_code` VARCHAR(191),
    `consumer_price` DECIMAL(10, 2) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `color` VARCHAR(10),
    `weight` DOUBLE,
    `option_view` ENUM('Y', 'N') NOT NULL DEFAULT 'Y',

    INDEX `goodsId`(`goodsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsOptionsSupplies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `goodsOptionsId` INTEGER NOT NULL,
    `stock` INTEGER UNSIGNED NOT NULL,
    `badstock` INTEGER UNSIGNED,
    `safe_stock` INTEGER DEFAULT 0,

    INDEX `goodsOptionsId`(`goodsOptionsId`),
    UNIQUE INDEX `GoodsOptionsSupplies_goodsOptionsId_unique`(`goodsOptionsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsImages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `goodsId` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `cut_number` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
    `info_name` VARCHAR(191) NOT NULL,
    `info_value` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER,
    `method` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191),
    `city` VARCHAR(191),
    `device` VARCHAR(191) NOT NULL,
    `ua` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `sellerId`(`sellerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShippingGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
    `baseAddress` VARCHAR(191) NOT NULL,
    `detailAddress` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `shipping_group_name` VARCHAR(255) NOT NULL,
    `shipping_calcul_type` ENUM('free', 'bundle', 'each') NOT NULL DEFAULT 'bundle',
    `shipping_calcul_free_yn` ENUM('Y', 'N') DEFAULT 'N',
    `shipping_std_free_yn` ENUM('Y', 'N') DEFAULT 'N',
    `shipping_add_free_yn` ENUM('Y', 'N') DEFAULT 'N',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShippingSet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipping_group_seq` INTEGER NOT NULL,
    `shipping_set_code` ENUM('delivery', 'direct_delivery', 'quick', 'freight', 'direct_store', 'custom') NOT NULL DEFAULT 'delivery',
    `shipping_set_name` VARCHAR(50) NOT NULL,
    `default_yn` ENUM('Y', 'N') DEFAULT 'N',
    `delivery_nation` ENUM('korea', 'global') NOT NULL DEFAULT 'korea',
    `delivery_limit` ENUM('unlimit', 'limit') NOT NULL DEFAULT 'unlimit',
    `refund_shiping_cost` DECIMAL(11, 2),
    `swap_shiping_cost` DECIMAL(11, 2),
    `prepay_info` ENUM('delivery', 'postpaid', 'all') NOT NULL DEFAULT 'delivery',
    `shiping_free_yn` ENUM('Y', 'N') NOT NULL DEFAULT 'N',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShippingOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipping_set_seq` INTEGER NOT NULL,
    `shipping_set_type` ENUM('std', 'add') NOT NULL DEFAULT 'std',
    `shipping_opt_type` ENUM('free', 'fixed', 'amount', 'amount_rep', 'cnt', 'cnt_rep', 'weight', 'weight_rep') NOT NULL DEFAULT 'free',
    `default_yn` ENUM('Y', 'N') DEFAULT 'N',
    `section_st` DOUBLE,
    `section_ed` DOUBLE,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShippingCost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipping_opt_seq` INTEGER NOT NULL,
    `shipping_cost` DECIMAL(11, 2),
    `shipping_area_name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveCommerceRanking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(191) NOT NULL DEFAULT '비회원',
    `text` LONGTEXT NOT NULL,
    `price` INTEGER NOT NULL,
    `phoneCallEventFlag` BOOLEAN NOT NULL DEFAULT false,
    `giftFlag` BOOLEAN NOT NULL DEFAULT false,
    `loginFlag` BOOLEAN NOT NULL DEFAULT true,
    `broadcasterId` VARCHAR(20) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Broadcaster` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(20) NOT NULL,
    `userNickname` VARCHAR(20) NOT NULL,
    `afreecaId` VARCHAR(191),
    `twitchId` VARCHAR(191),
    `youtubeId` VARCHAR(191),
    `overlayUrl` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleteFlag` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Broadcaster_userId_key`(`userId`),
    INDEX `Broadcaster_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SellerShop` ADD CONSTRAINT `SellerShop_sellerEmail_fkey` FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerBusinessRegistration` ADD CONSTRAINT `SellerBusinessRegistration_sellerEmail_fkey` FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlements` ADD CONSTRAINT `SellerSettlements_sellerEmail_fkey` FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementAccount` ADD CONSTRAINT `SellerSettlementAccount_sellerEmail_fkey` FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSocialAccount` ADD CONSTRAINT `SellerSocialAccount_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goods` ADD CONSTRAINT `Goods_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goods` ADD CONSTRAINT `Goods_shippingGroupId_fkey` FOREIGN KEY (`shippingGroupId`) REFERENCES `ShippingGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goods` ADD CONSTRAINT `Goods_goodsInfoId_fkey` FOREIGN KEY (`goodsInfoId`) REFERENCES `GoodsInfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsConfirmation` ADD CONSTRAINT `GoodsConfirmation_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsOptions` ADD CONSTRAINT `GoodsOptions_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsOptionsSupplies` ADD CONSTRAINT `GoodsOptionsSupplies_goodsOptionsId_fkey` FOREIGN KEY (`goodsOptionsId`) REFERENCES `GoodsOptions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsImages` ADD CONSTRAINT `GoodsImages_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsInfo` ADD CONSTRAINT `GoodsInfo_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoginHistory` ADD CONSTRAINT `LoginHistory_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingGroup` ADD CONSTRAINT `ShippingGroup_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingSet` ADD CONSTRAINT `ShippingSet_shipping_group_seq_fkey` FOREIGN KEY (`shipping_group_seq`) REFERENCES `ShippingGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingOption` ADD CONSTRAINT `ShippingOption_shipping_set_seq_fkey` FOREIGN KEY (`shipping_set_seq`) REFERENCES `ShippingSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingCost` ADD CONSTRAINT `ShippingCost_shipping_opt_seq_fkey` FOREIGN KEY (`shipping_opt_seq`) REFERENCES `ShippingOption`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LiveCommerceRanking` ADD CONSTRAINT `LiveCommerceRanking_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;