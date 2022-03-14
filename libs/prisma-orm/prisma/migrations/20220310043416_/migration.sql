/*
  Warnings:

  - You are about to drop the column `sellerEmail` on the `InactiveSellerBusinessRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `sellerEmail` on the `InactiveSellerSettlementAccount` table. All the data in the column will be lost.
  - You are about to drop the column `sellerEmail` on the `SellerBusinessRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `sellerEmail` on the `SellerSettlementAccount` table. All the data in the column will be lost.
  - You are about to drop the column `sellerEmail` on the `SellerSettlements` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `BusinessRegistrationIndex` ON `InactiveSellerBusinessRegistration`;

-- DropIndex
DROP INDEX `InactiveSellerBusinessRegistration_sellerEmail_sellerId_fkey` ON `InactiveSellerBusinessRegistration`;

-- DropIndex
DROP INDEX `InactiveSellerSettlementAccount_sellerEmail_sellerId_fkey` ON `InactiveSellerSettlementAccount`;

-- DropIndex
DROP INDEX `SellerSettlementAccountIndex` ON `InactiveSellerSettlementAccount`;

-- DropIndex
DROP INDEX `BusinessRegistrationIndex` ON `SellerBusinessRegistration`;

-- DropIndex
DROP INDEX `SellerSettlementAccountIndex` ON `SellerSettlementAccount`;

-- DropIndex
DROP INDEX `SellerSettlementsIndex` ON `SellerSettlements`;

-- AlterTable
ALTER TABLE `InactiveSellerBusinessRegistration` DROP COLUMN `sellerEmail`;

-- AlterTable
ALTER TABLE `InactiveSellerSettlementAccount` DROP COLUMN `sellerEmail`;

-- AlterTable
ALTER TABLE `SellerBusinessRegistration` DROP COLUMN `sellerEmail`;

-- AlterTable
ALTER TABLE `SellerSettlementAccount` DROP COLUMN `sellerEmail`;

-- AlterTable
ALTER TABLE `SellerSettlements` DROP COLUMN `sellerEmail`;

-- CreateIndex
CREATE INDEX `BusinessRegistrationIndex` ON `InactiveSellerBusinessRegistration`(`id`);

-- CreateIndex
CREATE INDEX `SellerSettlementAccountIndex` ON `InactiveSellerSettlementAccount`(`id`);

-- CreateIndex
CREATE INDEX `BusinessRegistrationIndex` ON `SellerBusinessRegistration`(`id`);

-- CreateIndex
CREATE INDEX `SellerSettlementAccountIndex` ON `SellerSettlementAccount`(`id`);

-- CreateIndex
CREATE INDEX `SellerSettlementsIndex` ON `SellerSettlements`(`id`);
