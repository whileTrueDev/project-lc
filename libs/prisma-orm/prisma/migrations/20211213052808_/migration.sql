-- CreateTable
CREATE TABLE `BroadcasterSettlements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `round` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `broadcasterId` INTEGER NOT NULL,

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

-- AddForeignKey
ALTER TABLE `BroadcasterSettlements` ADD CONSTRAINT `BroadcasterSettlements_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterSettlementItems` ADD CONSTRAINT `BroadcasterSettlementItems_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterSettlementItems` ADD CONSTRAINT `BroadcasterSettlementItems_broadcasterSettlementsId_fkey` FOREIGN KEY (`broadcasterSettlementsId`) REFERENCES `BroadcasterSettlements`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX `BroadcasterSettlements_broadcasterId_round_key` ON `BroadcasterSettlements`(`broadcasterId`, `round`);
