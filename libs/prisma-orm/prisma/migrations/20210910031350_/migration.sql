-- CreateTable
CREATE TABLE `ShippingGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShippingOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipping_set_seq` INTEGER NOT NULL,
    `shipping_set_type` ENUM('std', 'add') NOT NULL DEFAULT 'std',
    `shipping_opt_type` ENUM('free', 'fixed', 'amount', 'amount_rep', 'cnt', 'cnt_rep', 'weight', 'weight_rep') NOT NULL DEFAULT 'free',
    `default_yn` ENUM('Y', 'N') NOT NULL DEFAULT 'N',
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

-- AddForeignKey
ALTER TABLE `ShippingGroup` ADD FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingSet` ADD FOREIGN KEY (`shipping_group_seq`) REFERENCES `ShippingGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingOption` ADD FOREIGN KEY (`shipping_set_seq`) REFERENCES `ShippingSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingCost` ADD FOREIGN KEY (`shipping_opt_seq`) REFERENCES `ShippingOption`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
