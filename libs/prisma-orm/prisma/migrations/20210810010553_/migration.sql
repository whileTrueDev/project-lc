-- CreateTable
CREATE TABLE `MailVerificationCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `verificationCode` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
