-- CreateTable
CREATE TABLE `LiveShoppingEmbed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `streamingService` ENUM('twitch', 'afreeca') NOT NULL,
    `UID` VARCHAR(191) NOT NULL,
    `liveShoppingId` INTEGER NULL,

    UNIQUE INDEX `LiveShoppingEmbed_liveShoppingId_key`(`liveShoppingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LiveShoppingEmbed` ADD CONSTRAINT `LiveShoppingEmbed_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
