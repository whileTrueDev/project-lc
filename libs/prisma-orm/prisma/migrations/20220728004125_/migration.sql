/*
  Warnings:

  - You are about to alter the column `mileageStrategy` on the `MileageSetting` table. The data in that column could be lost. The data in that column will be cast from `Enum("MileageSetting_mileageStrategy")` to `Enum("MileageSetting_mileageStrategy")`.

*/
-- AlterTable
ALTER TABLE `MileageSetting` ADD COLUMN `useMileageFeature` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `mileageStrategy` ENUM('onPaymentPriceExceptMileageUsage', 'onPaymentPrice', 'onPaymentWithoutMileageUse') NOT NULL DEFAULT 'onPaymentWithoutMileageUse';


-- 전역 마일리지 설정 초기값 저장(마일리지 적립기능 사용안함으로 설정해둠)
INSERT INTO `MileageSetting` (`id`, `defaultMileagePercent`, `mileageStrategy`, `useMileageFeature`)
VALUES
	(1, 1, 'onPaymentWithoutMileageUse', 0);
