/*
  Warnings:

  - You are about to drop the column `reason` on the `ConfirmHistory` table. All the data in the column will be lost.
  - Added the required column `goodsOptionId` to the `OrderItemOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ConfirmHistory` DROP COLUMN `reason`;

-- AlterTable
ALTER TABLE `Customer` MODIFY `gender` ENUM('male', 'female', 'unknown') NULL DEFAULT 'unknown';

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `deleteFlag` BOOLEAN NULL DEFAULT false,
    MODIFY `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `OrderItemOption` ADD COLUMN `goodsOptionId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `PrivacyApproachHistory` ADD COLUMN `reason` VARCHAR(191) NULL;