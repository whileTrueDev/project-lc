-- CreateTable
CREATE TABLE `Policy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` ENUM('termsOfService', 'privacy') NOT NULL,
    `targetUser` ENUM('seller', 'broadcaster', 'all') NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `enforcementDate` DATETIME(3) NULL,
    `version` VARCHAR(191) NOT NULL,
    `publicFlag` BOOLEAN NOT NULL DEFAULT false,
    `content` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
