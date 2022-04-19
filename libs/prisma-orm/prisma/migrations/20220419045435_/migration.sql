/*
  Warnings:

  - You are about to drop the column `reason` on the `ConfirmHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `GoodsCategory` DROP FOREIGN KEY `GoodsCategory_parentCategoryId_fkey`;

-- AlterTable
ALTER TABLE `ConfirmHistory` DROP COLUMN `reason`;

-- AlterTable
ALTER TABLE `Customer` MODIFY `gender` ENUM('male', 'female', 'unknown') NULL DEFAULT 'unknown';

-- AlterTable
ALTER TABLE `PrivacyApproachHistory` ADD COLUMN `reason` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `GoodsCategory` ADD CONSTRAINT `GoodsCategory_parentCategoryId_fkey` FOREIGN KEY (`parentCategoryId`) REFERENCES `GoodsCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- GoodsCategory 초기더미데이터 추가
INSERT INTO `GoodsCategory` (`id`, `categoryCode`, `name`, `mainCategoryFlag`, `parentCategoryId`)
VALUES
	(1, '3OODwX2OsE8nUeu79ca59', '간편식/밀키트', 1, NULL),
	(2, 'KUr9dvph5fj5D3DL8yho9', '구이/조림.볶음', 0, 1),
	(3, 'cablIPmpwaBiyKfCKDd_L', '국/탕/찌개', 0, 1),
	(4, 'b-0sqerAdOBJ464uNH2R4', '에어프라이 조리', 0, 1),
	(5, 'mZG_DLtuJWpK9vO1V9pkm', '전자레인지 조리', 0, 1),
	(6, '_IGJGLoiep3kDtAXR5sez', '만두/튀김', 0, 1),
	(7, 'hcv1ikRITzKppia-6b5nn', '한식', 0, 1),
	(8, 'q7hHGLnrdivMtmAG0nZxy', '양식', 0, 1),
	(9, '4bAH23CrgZ7xP1oAs2C0I', '중식', 0, 1),
	(10, '8_ICTMpESlc4XXKBQdSE8', '반찬/조미료', 1, NULL),
	(11, 'Hzci_ng5v9SywavsE5WzO', '김치', 0, 10),
	(12, 'ODmmbG17fkpWBvJS44cDz', '천연조미료/오일', 0, 10),
	(13, '7-wlAhcqQj-pAY8EsHZ72', '젓갈', 0, 10),
	(14, 'Y0UhII4ELTwhdi5Fkw6c2', '건강식', 1, NULL),
	(15, 'oIA7PeZ4M6nrjVHgdSSYs', '샐러드 키트', 0, 14),
	(16, 'EXlXcEfmaWcPSc-q5BVMm', '고단백', 0, 14),
	(17, '4E4TiC8NytOvk29Rq8KFX', '저탄고지', 0, 14),
	(18, 'uknVdH_lwnmJrIOf4HIio', '견과류', 0, 14),
	(19, 'LXKbWJQkQgQKGLeifzPTN', '신선과즙', 0, 14),
	(20, 'bFJ7wnqOAuWfN3RmAfhAQ', '저칼로리', 0, 14),
	(21, 'VP07hyfPH0ZwVINGG_94b', '다이어트', 1, NULL),
	(22, '기타', '기타', 1, NULL);
