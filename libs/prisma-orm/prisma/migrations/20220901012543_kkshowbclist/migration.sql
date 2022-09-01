-- CreateTable
CREATE TABLE `KkshowBcList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(191) NOT NULL,
    `profileImage` VARCHAR(191) NOT NULL,
    `href` VARCHAR(191) NOT NULL,
    `broadcasterId` INTEGER NULL,

    UNIQUE INDEX `KkshowBcList_nickname_key`(`nickname`),
    UNIQUE INDEX `KkshowBcList_broadcasterId_key`(`broadcasterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `KkshowBcList` ADD CONSTRAINT `KkshowBcList_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
