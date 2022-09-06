-- CreateTable
CREATE TABLE `OverlayTheme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,
    `data` JSON NOT NULL,

    UNIQUE INDEX `OverlayTheme_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 기존 테마 추가
INSERT INTO `OverlayTheme` (`id`, `name`, `key`, `category`, `data`)
VALUES
	(1, '여름', '714SzBeLaH5UPk_aCIaeF', '계절', '{\"color\": \"\", \"textShadow\": \"5px 5px 10px rgba(43, 118, 255, 0.8)\", \"titleColor\": \"#ffffff\", \"backgroundColor\": \"rgba(217, 222, 255, 0.5)\", \"backgroundImage\": \"https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/overlay-theme-images/714SzBeLaH5UPk_aCIaeF/background.png\"}'),
	(2, '봄', 'xGS3Mlk7l68_YZ7PDbfhj', '계절', '{\"color\": \"\", \"textShadow\": \"5px 5px 10px #ea4867\", \"titleColor\": \"#ffffff\", \"backgroundColor\": \"rgba(255, 211, 225, 0.5)\", \"backgroundImage\": \"https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/overlay-theme-images/xGS3Mlk7l68_YZ7PDbfhj/background.png\"}'),
	(3, '치킨', 'fRlgJx4sU-UFrSmZXgVQp', '음식', '{\"color\": \"#ffffff\", \"textShadow\": \"5px 5px 10px rgba(220, 173, 0, 0.8)\", \"timerImage\": \"https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/overlay-theme-images/fRlgJx4sU-UFrSmZXgVQp/timer.png\", \"titleColor\": \"#ffffff\", \"podiumImage\": \"https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/overlay-theme-images/fRlgJx4sU-UFrSmZXgVQp/podium.png\", \"backgroundColor\": \"rgba(225, 224, 0, 0.7)\", \"backgroundImage\": \"https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/overlay-theme-images/fRlgJx4sU-UFrSmZXgVQp/background.png\"}');
