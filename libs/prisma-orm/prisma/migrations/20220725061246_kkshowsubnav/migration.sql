-- CreateTable
CREATE TABLE `KkshowSubNavLink` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `KkshowSubNavLink_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
