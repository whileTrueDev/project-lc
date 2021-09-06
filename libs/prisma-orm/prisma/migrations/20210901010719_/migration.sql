-- AlterTable
ALTER TABLE `Goods` MODIFY `runout_policy` ENUM('stock', 'ableStock', 'unlimited') DEFAULT 'unlimited';
