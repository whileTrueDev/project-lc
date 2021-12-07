/*
  Warnings:

  - You are about to drop the column `broadcasterId` on the `LiveCommerceRanking` table. All the data in the column will be lost.
  - Added the required column `broadcasterEmail` to the `LiveCommerceRanking` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
DROP TABLE `LiveCommerceRanking`;

-- CreateTable
CREATE TABLE `LiveCommerceRanking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(191) NOT NULL DEFAULT '비회원',
    `text` LONGTEXT NOT NULL,
    `price` INTEGER NOT NULL,
    `phoneCallEventFlag` BOOLEAN NOT NULL DEFAULT false,
    `giftFlag` BOOLEAN NOT NULL DEFAULT false,
    `loginFlag` BOOLEAN NOT NULL DEFAULT true,
    `broadcasterEmail` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LiveCommerceRanking` ADD CONSTRAINT `LiveCommerceRanking_broadcasterEmail_fkey` FOREIGN KEY (`broadcasterEmail`) REFERENCES `Broadcaster`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;