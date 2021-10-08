/*
  Warnings:

  - You are about to drop the column `fileName` on the `SellerBusinessRegistration` table. All the data in the column will be lost.
  - Added the required column `businessRegistrationImageName` to the `SellerBusinessRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mailOrderSalesImageName` to the `SellerBusinessRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mailOrderSalesNumber` to the `SellerBusinessRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SellerBusinessRegistration` DROP COLUMN `fileName`,
    ADD COLUMN `businessRegistrationImageName` VARCHAR(191) NOT NULL,
    ADD COLUMN `mailOrderSalesImageName` VARCHAR(191) NOT NULL,
    ADD COLUMN `mailOrderSalesNumber` VARCHAR(191) NOT NULL;
