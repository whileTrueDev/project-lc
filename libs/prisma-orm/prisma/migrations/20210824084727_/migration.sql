-- CreateTable
CREATE TABLE `GoodsConfirmation` (
    `id` INTEGER NOT NULL,
    `goodsId` INTEGER NOT NULL,
    `status` ENUM('waiting', 'confirmed', 'rejected') NOT NULL DEFAULT 'waiting',

    UNIQUE INDEX `GoodsConfirmation_goodsId_unique`(`goodsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GoodsConfirmation` ADD FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
