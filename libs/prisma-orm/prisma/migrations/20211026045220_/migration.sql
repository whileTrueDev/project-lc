/*
  Warnings:

  - You are about to drop the column `doneFlag` on the `SellerOrderCancelRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SellerOrderCancelRequest` DROP COLUMN `doneFlag`,
    ADD COLUMN `status` ENUM('waiting', 'done') NOT NULL DEFAULT 'waiting';
