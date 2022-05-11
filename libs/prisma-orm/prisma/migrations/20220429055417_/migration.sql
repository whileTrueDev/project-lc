-- DropForeignKey
ALTER TABLE `CartItem` DROP FOREIGN KEY `CartItem_shippingGroupId_fkey`;

-- AlterTable
ALTER TABLE `CartItem` MODIFY `shippingGroupId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_shippingGroupId_fkey` FOREIGN KEY (`shippingGroupId`) REFERENCES `ShippingGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
