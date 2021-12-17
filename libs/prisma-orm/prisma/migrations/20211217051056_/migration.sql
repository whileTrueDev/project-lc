-- AlterTable
ALTER TABLE `BroadcasterContacts` MODIFY `broadcasterId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Inquiry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `brandName` VARCHAR(191) NULL,
    `homepage` VARCHAR(191) NULL,
    `type` ENUM('seller', 'broadcaster') NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `readFlag` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
