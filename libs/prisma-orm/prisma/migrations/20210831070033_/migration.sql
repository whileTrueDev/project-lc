-- DropForeignKey
ALTER TABLE `Goods` DROP FOREIGN KEY `Goods_ibfk_1`;

-- AddForeignKey
ALTER TABLE `Goods` ADD FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
