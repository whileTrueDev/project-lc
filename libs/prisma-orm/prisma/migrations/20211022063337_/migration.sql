-- CreateTable
CREATE TABLE `SellerOrderCancelRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `orderSeq` VARCHAR(191) NOT NULL,
    `doneFlag` BOOLEAN NOT NULL DEFAULT false,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SellerOrderCancelRequest_orderSeq_idx`(`orderSeq`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellerOrderCancelRequestItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderItemSeq` INTEGER NOT NULL,
    `orderItemOptionSeq` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `orderSeq` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SellerOrderCancelRequest` ADD CONSTRAINT `SellerOrderCancelRequest_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerOrderCancelRequestItem` ADD CONSTRAINT `SellerOrderCancelRequestItem_orderSeq_fkey` FOREIGN KEY (`orderSeq`) REFERENCES `SellerOrderCancelRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
