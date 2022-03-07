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
