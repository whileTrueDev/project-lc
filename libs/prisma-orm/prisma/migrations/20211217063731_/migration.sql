-- AlterTable
ALTER TABLE `BroadcasterContacts` MODIFY `broadcasterId` INTEGER;

-- CreateTable
CREATE TABLE `Administrator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Administrator_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
