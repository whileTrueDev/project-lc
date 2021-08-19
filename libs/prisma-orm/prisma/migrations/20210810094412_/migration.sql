/*
  Warnings:

  - You are about to drop the column `service` on the `SocialAccount` table. All the data in the column will be lost.
  - Added the required column `provider` to the `SocialAccount` table without a default value. This is not possible if the table is not empty.
  - Made the column `sellerId` on table `SocialAccount` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `SocialAccount` DROP FOREIGN KEY `SocialAccount_ibfk_1`;

-- AlterTable
ALTER TABLE `SocialAccount` DROP COLUMN `service`,
    ADD COLUMN `accessToken` VARCHAR(191),
    ADD COLUMN `provider` VARCHAR(191) NOT NULL,
    ADD COLUMN `refreshToken` VARCHAR(191),
    MODIFY `sellerId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `SocialAccount` ADD FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
