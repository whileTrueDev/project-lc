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
    `common_contents` LONGTEXT NOT NULL,
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
    `image` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsOptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `goodsId` INTEGER NOT NULL,
    `default_option` ENUM('y', 'n') NOT NULL DEFAULT 'n',
    `option_type` VARCHAR(191) NOT NULL DEFAULT 'direct',
    `option_title` VARCHAR(191),
    `option_code` VARCHAR(191),
    `consumer_price` DECIMAL(10, 2) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `color` VARCHAR(10),
    `weight` DOUBLE,
    `option_view` ENUM('Y', 'N') NOT NULL DEFAULT 'Y',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsOptionsSupplies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `goodsOptionsId` INTEGER NOT NULL,
    `stock` INTEGER UNSIGNED NOT NULL,
    `badstock` INTEGER UNSIGNED,
    `safe_stock` INTEGER DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Goods` ADD FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsOptions` ADD FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsOptionsSupplies` ADD FOREIGN KEY (`goodsOptionsId`) REFERENCES `GoodsOptions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
