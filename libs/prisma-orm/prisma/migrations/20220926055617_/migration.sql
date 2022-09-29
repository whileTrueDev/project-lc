-- CreateTable
CREATE TABLE `KkshowEventPopup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `priority` INTEGER NOT NULL,
    `linkUrl` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `displayPath` JSON NOT NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,

    UNIQUE INDEX `KkshowEventPopup_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
