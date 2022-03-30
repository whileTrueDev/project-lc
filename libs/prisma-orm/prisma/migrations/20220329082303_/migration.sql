-- CreateTable
CREATE TABLE `Manual` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `target` ENUM('seller', 'broadcaster') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `contents` TEXT NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
