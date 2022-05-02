-- AlterTable
ALTER TABLE `Policy` MODIFY `targetUser` ENUM('seller', 'broadcaster', 'customer', 'all') NOT NULL;
