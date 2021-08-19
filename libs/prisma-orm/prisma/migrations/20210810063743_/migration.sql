-- CreateTable
CREATE TABLE `SocialAccount` (
    `serviceId` VARCHAR(191) NOT NULL,
    `service` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `profileImage` VARCHAR(191),
    `registDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sellerId` INTEGER,

    PRIMARY KEY (`serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SocialAccount` ADD FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
