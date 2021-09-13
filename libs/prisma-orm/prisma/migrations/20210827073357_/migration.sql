-- AlterTable
ALTER TABLE `Goods` ADD COLUMN `goods_view` ENUM('look', 'notLook') NOT NULL DEFAULT 'look',
    ADD COLUMN `regist_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `runout_policy` ENUM('stock', 'ableStock', 'unlimited'),
    ADD COLUMN `update_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
