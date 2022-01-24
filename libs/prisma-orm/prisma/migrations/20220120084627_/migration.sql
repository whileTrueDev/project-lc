-- CreateTable
CREATE TABLE `LiveShoppingStateBoardMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `liveShoppingId` INTEGER NOT NULL,

    INDEX `LiveShoppingStateBoardMessage_liveShoppingId_idx`(`liveShoppingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveShoppingStateBoardAlert` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `liveShoppingId` INTEGER NOT NULL,

    INDEX `LiveShoppingStateBoardAlert_liveShoppingId_idx`(`liveShoppingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
