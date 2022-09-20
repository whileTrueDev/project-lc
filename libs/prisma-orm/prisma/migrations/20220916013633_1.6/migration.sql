-- CreateTable
CREATE TABLE `AdminLastCheckedData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- 관리자가 확인한 가장 최근 id 저장 초기데이터 생성
INSERT INTO `AdminLastCheckedData` (`id`, `data`)
VALUES
	(1, '{}');


-- AlterTable
ALTER TABLE `BroadcasterSettlementItems` MODIFY `orderId` VARCHAR(191) NULL,
    MODIFY `exportCode` VARCHAR(191) NULL;
