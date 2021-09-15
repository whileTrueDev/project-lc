/*
  Warnings:

  - Added the required column `baseAddress` to the `ShippingGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detailAddress` to the `ShippingGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `ShippingGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ShippingGroup` ADD COLUMN `baseAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `detailAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `postalCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ShippingSet` ADD COLUMN `prepay_info` ENUM('delivery', 'postpaid', 'all') NOT NULL DEFAULT 'delivery',
    ADD COLUMN `shiping_free_yn` ENUM('Y', 'N') NOT NULL DEFAULT 'N';
