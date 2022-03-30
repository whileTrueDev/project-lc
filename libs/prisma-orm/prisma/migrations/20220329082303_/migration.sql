-- CreateTable
CREATE TABLE `Manual` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `target` ENUM('seller', 'broadcaster') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `contents` TEXT NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- 초기데이터 (더미) 입력 220323 @joni
INSERT INTO `Manual` (`id`, `target`, `title`, `description`, `order`, `contents`, `createDate`, `updateDate`)
VALUES
	(1, 'seller', '상품', '판매할 상품을 등록하고 관리할 수 있습니다.', 1, '<div class=\"se-component se-image-container __se__float-none\" contenteditable=\"false\"><figure style=\"margin: 0px;\"><img src=\"https://lc-project.s3.ap-northeast-2.amazonaws.com/manual/상품.png_1648599405008\" alt=\"\" data-rotate=\"\" data-proportion=\"true\" data-rotatex=\"\" data-rotatey=\"\" data-size=\",\" data-align=\"none\" data-percentage=\"auto,auto\" data-index=\"0\" data-file-name=\"상품.png\" data-file-size=\"89914\" data-origin=\",\" style=\"\"></figure></div>', '2022-03-30 00:16:48.920', '2022-03-30 00:16:48.920'),
	(2, 'seller', '상품>등록', ' ', 2, '<div class=\"se-component se-image-container __se__float-none\" contenteditable=\"false\"><figure style=\"margin: 0px;\"><img src=\"https://lc-project.s3.ap-northeast-2.amazonaws.com/manual/상품등록1.png_1648599429856\" alt=\"\" data-rotate=\"\" data-proportion=\"true\" data-rotatex=\"\" data-rotatey=\"\" data-size=\",\" data-align=\"none\" data-percentage=\"auto,auto\" data-index=\"0\" data-file-name=\"상품등록1.png\" data-file-size=\"118654\" data-origin=\",\" style=\"\"></figure></div><div class=\"se-component se-image-container __se__float-none\" contenteditable=\"false\"><figure style=\"margin: 0px;\"><img src=\"https://lc-project.s3.ap-northeast-2.amazonaws.com/manual/상품등록2.png_1648599438127\" alt=\"\" data-rotate=\"\" data-proportion=\"true\" data-rotatex=\"\" data-rotatey=\"\" data-size=\",\" data-align=\"none\" data-percentage=\"auto,auto\" data-index=\"1\" data-file-name=\"상품등록2.png\" data-file-size=\"114610\" data-origin=\",\" style=\"\"></figure></div><div class=\"se-component se-image-container __se__float-none\" contenteditable=\"false\"><figure style=\"margin: 0px;\"><img src=\"https://lc-project.s3.ap-northeast-2.amazonaws.com/manual/상품등록3.png_1648599447213\" alt=\"\" data-rotate=\"\" data-proportion=\"true\" data-rotatex=\"\" data-rotatey=\"\" data-size=\",\" data-align=\"none\" data-percentage=\"auto,auto\" data-index=\"2\" data-file-name=\"상품등록3.png\" data-file-size=\"164384\" data-origin=\",\" style=\"\"></figure></div><div class=\"se-component se-image-container __se__float-none\" contenteditable=\"false\"><figure style=\"margin: 0px;\"><img src=\"https://lc-project.s3.ap-northeast-2.amazonaws.com/manual/상품등록4.png_1648599454689\" alt=\"\" data-rotate=\"\" data-proportion=\"true\" data-rotatex=\"\" data-rotatey=\"\" data-size=\",\" data-align=\"none\" data-percentage=\"auto,auto\" data-index=\"3\" data-file-name=\"상품등록4.png\" data-file-size=\"117016\" data-origin=\",\" style=\"\"></figure></div>', '2022-03-30 00:17:53.131', '2022-03-30 00:17:53.131');
