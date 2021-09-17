/*
  Warnings:

  - You are about to drop the column `shopName` on the `Seller` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Seller` DROP COLUMN `shopName`;

-- CreateTable
CREATE TABLE `SellerShop` (
    `sellerEmail` VARCHAR(191) NOT NULL,
    `shopName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SellerShop.sellerEmail_unique`(`sellerEmail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SellerShop` ADD FOREIGN KEY (`sellerEmail`) REFERENCES `Seller`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
