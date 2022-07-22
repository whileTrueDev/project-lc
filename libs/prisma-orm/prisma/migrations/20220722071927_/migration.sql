-- AlterTable
ALTER TABLE `MileageSetting` MODIFY `mileageStrategy` ENUM('onPaymentPriceExceptMileageUsage', 'onPaymentPrice', 'noMileage') NOT NULL DEFAULT 'noMileage';


-- 마일리지세팅 초기값 (적립율 1%, 마일리지 사용시 마일리지 적립안함) 추가 
INSERT INTO `MileageSetting` (`defaultMileagePercent`, `mileageStrategy`) VALUES (1, 'noMileage');
