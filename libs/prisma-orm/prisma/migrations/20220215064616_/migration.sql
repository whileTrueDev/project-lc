-- AlterTable
ALTER TABLE `Broadcaster` ADD COLUMN `inactiveFlag` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `userName` VARCHAR(20) NULL,
    MODIFY `overlayUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Seller` ADD COLUMN `inactiveFlag` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `email` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `InactiveBroadcaster` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NULL,
    `userName` VARCHAR(20) NULL,
    `userNickname` VARCHAR(20) NULL,
    `overlayUrl` VARCHAR(191) NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `password` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,

    UNIQUE INDEX `InactiveBroadcaster_email_key`(`email`),
    UNIQUE INDEX `InactiveBroadcaster_overlayUrl_key`(`overlayUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InactiveSeller` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,

    UNIQUE INDEX `InactiveSeller_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
