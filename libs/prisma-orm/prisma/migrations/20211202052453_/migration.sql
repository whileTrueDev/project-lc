/*
  Warnings:

  - You are about to drop the column `sellerId` on the `LoginHistory` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `LoginHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userType` to the `LoginHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
DROP TABLE `LoginHistory`;

-- CreateTable
CREATE TABLE `LoginHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userEmail` VARCHAR(191) NOT NULL,
    `userType` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191),
    `city` VARCHAR(191),
    `device` VARCHAR(191) NOT NULL,
    `ua` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;