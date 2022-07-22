/*
  Warnings:

  - You are about to drop the column `amount` on the `ExchangeItem` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `ExportItem` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `OrderCancellationItem` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `RefundItem` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `ReturnItem` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `SellerOrderCancelRequestItem` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `ExchangeItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `ExportItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `OrderCancellationItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `RefundItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `ReturnItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `SellerOrderCancelRequestItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ExchangeItem` DROP COLUMN `amount`,
    ADD COLUMN `quantity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ExportItem` DROP COLUMN `amount`,
    ADD COLUMN `quantity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OrderCancellationItem` DROP COLUMN `amount`,
    ADD COLUMN `quantity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `RefundItem` DROP COLUMN `amount`,
    ADD COLUMN `quantity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ReturnItem` DROP COLUMN `amount`,
    ADD COLUMN `quantity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `SellerOrderCancelRequestItem` DROP COLUMN `amount`,
    ADD COLUMN `quantity` INTEGER NOT NULL;
