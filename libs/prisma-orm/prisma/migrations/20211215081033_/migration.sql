-- AlterTable
ALTER TABLE `BroadcasterContacts` MODIFY `broadcasterId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Inquiry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `brandName` VARCHAR(191) NOT NULL,
    `homepage` VARCHAR(191) NOT NULL,
    `type` ENUM('seller', 'broadcaster') NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `readFlag` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
