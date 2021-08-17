-- CreateTable
CREATE TABLE `Seller` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191),
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Seller.email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
