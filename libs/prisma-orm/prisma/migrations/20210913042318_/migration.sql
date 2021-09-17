-- AlterTable
ALTER TABLE `Goods` ADD COLUMN `shippingGroupId` INTEGER;

-- AddForeignKey
ALTER TABLE `Goods` ADD FOREIGN KEY (`shippingGroupId`) REFERENCES `ShippingGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
