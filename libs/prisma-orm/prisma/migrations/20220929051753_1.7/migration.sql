-- AlterTable
ALTER TABLE `LiveShoppingExternalGoods` ADD COLUMN `imageUrl` TEXT NULL;

-- CreateTable
CREATE TABLE `LiveShoppingEmbed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `streamingService` ENUM('twitch', 'afreeca') NOT NULL,
    `UID` VARCHAR(191) NOT NULL,
    `liveShoppingId` INTEGER NULL,

    UNIQUE INDEX `LiveShoppingEmbed_liveShoppingId_key`(`liveShoppingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LiveShoppingEmbed` ADD CONSTRAINT `LiveShoppingEmbed_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `KkshowEventPopup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `priority` INTEGER NOT NULL,
    `linkUrl` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `displayPath` JSON NOT NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,

    UNIQUE INDEX `KkshowEventPopup_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KkshowShoppingTabSectionOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KkshowShoppingSectionItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `layoutType` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `data` JSON NOT NULL,
    `link` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 섹션 순서 초기값
INSERT INTO `KkshowShoppingTabSectionOrder` (`id`, `order`)
VALUES
	(1, '[2, 3, 4, 5, 6, 7]');

-- 섹션데이터 초기값
INSERT INTO `KkshowShoppingSectionItem` (`id`, `layoutType`, `title`, `description`, `data`, `link`)
VALUES
	(1, 'carousel', '상단 캐러셀', NULL, '[{\"linkUrl\": \"\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/kkshow-shopping-carousel-images/1660810092166_kks_main_banner_2.png\", \"description\": \"\"}, {\"linkUrl\": \"https://k-kmarket.com/\", \"imageUrl\": \"https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/kkshow-shopping-carousel-images/1649138041072_banner-3.png\", \"description\": \"\"}, {\"linkUrl\": \"https://k-kmarket.com/\", \"imageUrl\": \"https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/kkshow-shopping-carousel-images/1649138023040_banner-1.png\", \"description\": \"\"}, {\"linkUrl\": \"https://k-kmarket.com/\", \"imageUrl\": \"https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/kkshow-shopping-carousel-images/1649138031589_banner-2.png\", \"description\": \"\"}]', NULL),
	(2, 'square--auto-slide', '시선 집중! 금주의 상품', NULL, '[{\"name\": \"미트업 담백해바 스타터팩 12개입\", \"linkUrl\": \"/goods/19\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/csp0712@naver.com/220512101117_[%EA%BE%B8%EB%AF%B8%EA%B8%B0]DSC01291.jpg\", \"normalPrice\": 31400, \"discountedPrice\": 28000}, {\"name\": \"백종원의 3대천왕 출연 속초 닭강정 (반반)\", \"linkUrl\": \"/goods/12\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/junogogo@naver.com/220321143053_%EC%98%88%EC%8A%A4%EB%8B%AD%EA%B0%95%EC%A0%95.jpg\", \"normalPrice\": 15000, \"discountedPrice\": \"\"}, {\"name\": \"술 안주로 딱인 양념닭불고기 350g\", \"linkUrl\": \"/goods/22\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/3533665@naver.com/220708164359_172_temp_16445574046693view.png\", \"normalPrice\": 7000, \"discountedPrice\": \"\"}, {\"name\": \"식스레시피 감바스 밀키트 캠핑 요리\", \"linkUrl\": \"/goods/27\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/alsrhks1994@naver.com/220712144133_감바스_상품사진1.jpg\", \"normalPrice\": 17000, \"discountedPrice\": 14900}, {\"name\": \"밥 한 공기 뚝딱 100% 한돈 수제 떡갈비\", \"linkUrl\": \"/goods/36\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/3bmkt@naver.com/220712164904_떡갈비_상품사진1jpg.jpg\", \"normalPrice\": 3500, \"discountedPrice\": \"\"}]', NULL),
	(3, 'small-square--row', '놓치면 아쉬운 신상 라인업', NULL, '[{\"name\": \"맛있게 매운 삼형제 양념 쭈꾸미\", \"linkUrl\": \"/goods/5\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/3bmkt@naver.com/220117115527__temp_16405271386492view.jpg\", \"normalPrice\": 8900, \"discountedPrice\": \"\"}, {\"name\": \"부드럽고 달큰한 닭불갈비 1kg\", \"linkUrl\": \"/goods/7\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/3533665@naver.com/220222171450__temp_16444776848987view.jpg\", \"normalPrice\": 12300, \"discountedPrice\": 9900}, {\"name\": \"백종원의 3대천왕 속초 닭강정 (블랙)\", \"linkUrl\": \"/goods/14\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/junogogo@naver.com/220321144251_정방형_2.jpg\", \"normalPrice\": 15000, \"discountedPrice\": \"\"}, {\"name\": \"매운 양념 무뼈닭발 뼈 없는 닭발 350g/600g\", \"linkUrl\": \"/goods/23\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/3533665@naver.com/220708164922_양념 무뼈닭발1.jpg\", \"normalPrice\": 8900, \"discountedPrice\": \"\"}, {\"name\": \"식스레시피 밀푀유나베 밀키트 (2인분)\", \"linkUrl\": \"/goods/26\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/alsrhks1994@naver.com/220712141257_밀푀유나베_상품사진1.jpg\", \"normalPrice\": 21800, \"discountedPrice\": \"\"}]', NULL),
	(4, 'rect--grid', '다른 고객님들이 많이 찾은 상품', NULL, '[{\"name\": \"오동통한 100% 한돈 수제 소세지\", \"linkUrl\": \"/goods/37\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/3bmkt@naver.com/220712165551_소세지_상품사진.jpg\", \"normalPrice\": 3900, \"discountedPrice\": \"\"}, {\"name\": \"식스레시피 쉬림프 로제 파스타 밀키트 (2인분)\", \"linkUrl\": \"/goods/31\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/alsrhks1994@naver.com/220712152334_로제파스타_상품사진1.jpg\", \"normalPrice\": 14900, \"discountedPrice\": 12900}, {\"name\": \"맛있게 매콤한 닭꼬치 중꼬지 200g\", \"linkUrl\": \"/goods/24\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/3533665@naver.com/220708165548_닭꼬치1.jpg\", \"normalPrice\": 5700, \"discountedPrice\": \"\"}, {\"name\": \"술 안주로 딱인 양념닭불고기 350g\", \"linkUrl\": \"/goods/22\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/3533665@naver.com/220708164359_172_temp_16445574046693view.png\", \"normalPrice\": 7000, \"discountedPrice\": \"\"}, {\"name\": \"식스레시피 찹스테이크 밀키트 (2인분)\", \"linkUrl\": \"/goods/33\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/alsrhks1994@naver.com/220712154951_찹스테이크_상품사진1.jpg\", \"normalPrice\": 17900, \"discountedPrice\": 16900}]', NULL),
	(5, 'banner', '신규 가입 쿠폰 배너', NULL, '\"{\\\"linkUrl\\\":\\\"https://www.xn--hp4b17xa.com/signup\\\",\\\"message\\\":\\\"신규 가입하고 1,000원 할인 쿠폰 GET\\\",\\\"imageUrl\\\":\\\"https://lc-project.s3.ap-northeast-2.amazonaws.com/kkshow-shopping-banner-images/1648512619378_coupon.png\\\",\\\"fontColor\\\":\\\"\\\",\\\"backgroundColor\\\":\\\"\\\",\\\"backgroundRepeat\\\":\\\"\\\",\\\"backgroundPosition\\\":\\\"right\\\",\\\"backgroundSize\\\":\\\"20%\\\"}\"', '/signup'),
	(6, 'big-square--row', '크크마켓 추천상품', NULL, '[{\"name\": \"식스레시피 소고기 잡채 밀키트 (2인분)\", \"linkUrl\": \"/goods/29\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/alsrhks1994@naver.com/220712145931_잡채_상품사진1.jpg\", \"normalPrice\": 11900, \"discountedPrice\": 10900}, {\"name\": \"식스레시피 밀푀유나베 밀키트 (2인분)\", \"linkUrl\": \"/goods/26\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/alsrhks1994@naver.com/220712141257_밀푀유나베_상품사진1.jpg\", \"normalPrice\": 21800, \"discountedPrice\": \"\"}, {\"name\": \"식스레시피 치킨 까르보나라 파스타 밀키트 (2인분)\", \"linkUrl\": \"/goods/32\", \"imageUrl\": \"https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/alsrhks1994@naver.com/220712154226_까르보나라_상품사진1.jpg\", \"normalPrice\": 12900, \"discountedPrice\": 10900}]', NULL),
	(7, 'rating-detail--row', '생생후기', NULL, '[{\"title\": \"떡갈비 맛있어요\", \"rating\": 5, \"linkUrl\": \"https://k-kmarket.com/board/view?id=goods_review&seq=10\", \"contents\": \"떡갈비 맛있어요!! 구워서 햄버거빵 사이에 넣어 먹었는데 불고기버거 먹는 맛이 났어요 \\n밥이랑 먹어도 맛있을거같아요 다음에 또 살게요!!\", \"imageUrl\": \"https://k-kmarket.com/data/board/goods_review/873dfd04f466d76f27e88e482633934c1310364.jpg\", \"createDate\": \"2022-03-24\"}, {\"title\": \"양도 많고 맛있어요\", \"rating\": 5, \"linkUrl\": \"https://k-kmarket.com/board/view?id=goods_review&seq=6\", \"contents\": \"한번 사먹고 너무 맛있어서 또 샀네요 ㅋㅋ\\n\\n가격 대비 가성비 좋아요\\n\\n쭈꾸미 식감도 좋고 밥 볶아 먹으니 꿀맛입니다\\n\\n많이 맵지는 않은데 맵찔이라면 마요네즈 추가 필수\\n\\n번창하세요~\", \"imageUrl\": \"https://k-kmarket.com/data/board/goods_review/761167a21b74945284840126978ac0611424122.jpg\", \"createDate\": \"2022-03-25\"}, {\"title\": \"유명한 예스 닭강정 \", \"rating\": \"5\", \"linkUrl\": \"https://k-kmarket.com/board/view?id=goods_review&seq=2\", \"contents\": \"티비에서 방송하는걸 본적 있던 예스닭강정\\n\\n\\n\\n이번에 라이브커머스로 소개되자마자 예전 기억이 떠오르면서 구매하게 됐습니다\\n\\n\\n\\n\\n\\n일단 기본적으로 닭강정입니다\\n\\n\\n\\n네, 실패할수가 없다는 말이죠\\n\\n\\n\\n다만 뼈있는 닭강정이 아니라 순살 닭강정입니다\\n\\n\\n\\n네, 먹기가 편하다는거죠\\n\\n\\n\\n기본적으로 닭강정들은 먹을때 따로 뎁히지 않고 차갑게 된 상태에서 먹는게 국룰입니다\\n\\n\\n\\n다만 예스닭강정의 경우 순살 닭강정이다 보니 차갑게 먹는것보다 전자레인지에 살짝 뎁히는편이 더 좋았습니다\\n\\n\\n\\n1분은 좀 과했고, 30초정도가 딱 좋았네요\\n\\n\\n\\n세일즈포인트중 하나가 공기층이 같이 있어서 부들부들한 식감이었는데, 30초 뎁히니까 딱 부드러우면서 쫄깃하고 달콤한 닭강정 최적의 맛이 나왔습니다\\n\\n\\n\\n블랙닭강정의 경우는 일단 신기해서 같이 시켜봤는데요.\\n\\n\\n\\n일단 생각하는 맛은 아닙니다.\\n\\n\\n\\n춘장이 들어가있기는 한데, 그렇다고 짜장맛은 아니구요\\n\\n\\n\\n기본적인 닭강정맛에서 매운맛을 조금 더 덜어내고, 달짝한 맛이 추가됐습니다\\n\\n\\n\\n그리고 춘장이 들어가서 소스가 일반 닭강정보다 약간 꾸덕한 느낌이 듭니다. 춘장맛은 일부러 찾으려고 하지 않으면 잘 느껴지지는 않고, 꾸덕함과 달짝한 맛이 더 추가됐다고 생각하시면 되겠습니다\\n\\n\\n\\n그리고 먹는다고 이빨이 까매지지는 않았습니다\\n\\n\\n\\n색다른 닭강정이 먹고 싶다면 한번쯤 도전해볼만 합니다. 기본 닭강정에서 지나치게 바뀌진 않으면서 다른맛이 납니다\\n\\n\\n\\n\\n\\n결론 - 닭강정은 항상 맛있다. 존..맛 \", \"imageUrl\": \"https://i.ibb.co/Qbm6Lyp/Kakao-Talk-20211221-194813657.jpg\", \"createDate\": \"2021-12-21\"}, {\"title\": \"배송이 잘못왔는데 대처가 너무 만족스럽습니다.\", \"rating\": \"5\", \"linkUrl\": \"https://k-kmarket.com/board/view?id=goods_review&seq=4\", \"contents\": \"배송이 잘못왔는데 대처가 너무 만족스럽습니다.\", \"imageUrl\": \"https://phinf.pstatic.net/checkout.phinf/20220123_210/1642904591443WBJrD_JPEG/review-attachment-7eab1102-c0fb-4276-8eb5-bad83ff536b6.jpeg?type=w640\", \"createDate\": \"2022-01-23\"}]', NULL);
