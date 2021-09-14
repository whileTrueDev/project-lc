-- CreateTable
CREATE TABLE `LiveCommerceRanking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(191) NOT NULL DEFAULT '비회원',
    `text` LONGTEXT NOT NULL,
    `price` INTEGER NOT NULL,
    `phoneCallEventFlag` VARCHAR(191) NOT NULL DEFAULT '0',
    `loginFlag` VARCHAR(191) NOT NULL DEFAULT '0',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
