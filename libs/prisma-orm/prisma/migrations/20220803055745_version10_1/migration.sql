-- CreateTable
CREATE TABLE `LiveShoppingMessageSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `levelCutOffPoint` INTEGER NOT NULL DEFAULT 30000,
    `ttsSetting` ENUM('full', 'nick_purchase', 'nick_purchase_price', 'only_message', 'no_tts', 'no_sound') NOT NULL DEFAULT 'full',
    `fanNick` VARCHAR(191) NOT NULL DEFAULT '비회원',
    `liveShoppingId` INTEGER NOT NULL,

    UNIQUE INDEX `LiveShoppingMessageSetting_liveShoppingId_key`(`liveShoppingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LiveShoppingMessageSetting` ADD CONSTRAINT `LiveShoppingMessageSetting_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
