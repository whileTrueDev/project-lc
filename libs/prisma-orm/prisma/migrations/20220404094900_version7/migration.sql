
-- CreateTable
CREATE TABLE `Manual` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `target` ENUM('seller', 'broadcaster') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `contents` TEXT NOT NULL,
    `mainCategory` VARCHAR(191) NOT NULL,
    `linkPageRouterPath` VARCHAR(191) NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- 더미 이용안내 데이터 추가 220330 joni
INSERT INTO `Manual` (`id`, `target`, `title`, `description`, `order`, `contents`, `createDate`, `updateDate`, `linkPageRouterPath`, `mainCategory`)
VALUES
	(3, 'seller', '상품 목록', '판매할 상품을 등록하고 관리할 수 있습니다.', 1, '<ol><li><p><strong>상품등록</strong></p><p>상품 정보를 등록하는 페이지로 이동합니다.</p></li><li><p><strong>선택 삭제</strong></p><p>상품을 선택하여 삭제 가능합니다. 상품 삭제 시 복구는 불가능하며 해당 상품에 연결된 주문이 없어야 삭제 가능합니다.</p></li><li><p><strong>상품 정렬</strong>&nbsp;</p><p>한페이지에 보여질 상품 개수를 설정할 수 있습니다.</p></li><li><p><strong>상품명</strong></p><p>클릭시 등록한 상품 정보를 볼 수 있습니다.</p></li><li><p><strong>배송비</strong></p><p>해당 상품과 연결된 배송 정보를 확인할 수 있습니다.</p></li><li><p><strong>노출 여부</strong></p><p>상품의 노출 상태를 변경할 수 있습니다.</p></li><li><p><strong>검수상태</strong></p><p>관리자가 등록한 상품을 검수하고 승인 혹은 거절합니다. 거절시 거절 사유가 표시되며, 안내에 따라 재등록 진행하실 수 있습니다.</p></li><li><p><strong>수정하기</strong></p><p>등록한 상품 정보를 변경하는 페이지도 이동합니다.</p></li></ol>', '2022-03-30 02:57:14.819', '2022-03-31 05:16:00.497', '/mypage/goods', 'goods'),
	(4, 'seller', '상품 등록', ' ', 2, '<p>1. 상품목록 돌아가기 <br>상품 목록으로 돌아갑니다. (저장하지 않고 돌아갈 시 삭제됩니다.)<br>2. 등록<br>작성한 정보들을 등록합니다. 주의) 등록을 하지 않고 페이지를 나가시면 저장되지 않습니다.     <br>3. 상품명<br>판매할 상품명을 입력합니다.<br>4. 간략설명<br>간략한 상품 설명(정보) 를 입력하는 메뉴입니니다.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <br>5. 판매정보<br>- 판매 상태 : <br>1) 정상(상품이 정상적으로 판매되는 상태), <br>2) 재고확보중(재고가 없는 경우, 판매가 되지 않습니다.), <br>3)판매 중지(상품 판매를 중지 합니다.)<br>- 청약 철회 : 상품이 취소/교환/반품이 되는지 여부를 선택합니다.<br>    <br>    1. 판매 옵션<br>    1) 옵션 사용 선택시<br>    - 옵션명 : 옵션명을 기재합니다. 사이즈나 색상을 선택하도록 하는 상품이라면 옵션명은 색상 / 사이즈 각각 생성을 해주셔야합니다.<br>    - 옵션값 : 옵션명에 해당되는 선택해야할 값을 입력합니다.<br>    - 옵션값 추가 : 여러 종류의 옵션이 있는 경우 ‘옵션값 추가’ 버튼을 클릭하여 옵션을 추가할 수 있습니다.<br>        <br>        <br>        2) 옵션 사용 안 함 선택시<br>        <br>        정가(미할인가), 판매가(할인가)를 입력합니다. 모두 입력하셔야 할인율이 표시됩니다. (할인 진행 하지 않으면 판매가만 표시)<br></p>', '2022-03-30 02:58:47.597', '2022-03-31 05:16:07.869', '/mypage/goods/regist', 'goods'),
	(5, 'seller', '라이브쇼핑 목록', ' ', 1, '<p><span style=\"font-size: 16px;\">1. 라이브 쇼핑 진행 요청 : 라이브 쇼핑을 진행 요청 페이지로 이동합니다.<br>2. 라이브 쇼핑명 : 크크쇼 관리자가 라이브 쇼핑을 조율하고 결정된 컨텐츠 이름이 결정되면 자동으로 수정됩니다.<br>3. 상품명 : 라이브 쇼핑에서 판매할 상품의 상품 상세 페이지로 이동합니다.(실제 고객에게 보여질 페이지)<br>4. 상태 :<br>1) 등록됨 : 라이브 쇼핑이 정상적으로 등록됨을 나타냅니다.<br>2) 조율중 : 관리자가 신청 내용을 확인하고 방송인과 협의하는 단계입니다. (영업일 기준 3~5일)<br>3) 확정됨 : 방송인, 방송 시간, 판매시간이 협의가 끝나고 라이브 쇼핑 일정이 확정된 상태입니다. 확정된 상태인 경우 일정 취소가 불가합니다. <br>4) 취소됨 : 입력하신 조건으로 라이브 쇼핑이 불가할 때 관리자에 의해 라이브 쇼핑이 취소될 수 있습니다.​</span><br></p>', '2022-03-30 02:59:43.590', '2022-03-31 05:16:13.210', '/mypage/live', 'live'),
	(6, 'seller', '라이브쇼핑 등록', ' ', 2, '<ul><li><p>목록으로 : 라이브 쇼핑 목록으로 이동합니다.</p></li><li><p>라이브 쇼핑을 진행할 상품 : 라이븟 쇼핑에서 판매할 상품을 선택합니다.</p></li><li><p>새연락처 : 등록한 연락처가 없는 경우 새연락처를 등록합니다.</p></li><li><p>기본으로 설정 : 기본으로 설정하고 등록하는 경우 다음 라이브 쇼핑 등록시 기본 연락처가 보여집니다.</p></li><li><p>기존 연락처 : 등록한 연락처가 있는경우 선택하면 기본으로 설정한 연락처가 보여집니다.</p></li><li><p>희망 진행 기간 : 원하는 진행 기간을 설정할 수 있습니다. 특정 날짜가 있다면 ‘직접 입력’으로 등록할 수 있습니다.</p></li><li><p>희망 판매 수수료 : 판매 수수료를 제안하실 수 있습니다. 확정 수수료는 방송인과 협의를 통해 결정됩니다.</p></li><li><p>요청사항 : 라이브 쇼핑시 언급해야될 사항 등 방송인이 언급하여야할 부분들을 작성해주세요.</p></li><li><p>등록 : 모든 필수 항목을 작성하고 등록 버튼을 눌러주세요. 등록하지 않고 페이지에서 벗어나면 저장되지 않을 수 있습니다.</p></li></ul>', '2022-03-30 04:35:29.302', '2022-03-31 05:16:19.337', '/mypage/live/regist', 'live'),
	(7, 'seller', '주문관리', ' ', 1, '<ul><li><p>검색<span>&nbsp;</span><strong>:</strong>&nbsp;아래에서 설정한 검색방법으로 주문을 검색할 수 있습니다.</p></li><li><p>날짜 : 조회할 주문의 날짜를 설정합니다.</p></li><li><p>주문 상태 : 조회할 주문의 상태를 정합니다.</p></li><li><p>출고처리<span>&nbsp;</span><strong>:</strong>&nbsp;접수된 주문 (결제확인, 상품준비 등의 상태 시)에 대한 출고처리를 진행할 수 있습니다.</p></li><li><p>내보내기 : 아래 선택한 주문을 CSV 파일 형식으로 다운로드를 받습니다.</p></li><li><p>주문번호 : 주문번호를 클릭하면 주문 상세페이지로 이동합니다.</p></li></ul>', '2022-03-30 04:36:32.662', '2022-03-31 05:16:25.652', '/mypage/orders', 'order'),
	(8, 'seller', '정산', ' ', 1, '<ul><li><p>정산 정보</p><ul><li><strong>정산준비</strong><span>&nbsp;</span>: 정산이 가능한 상태인지 표시합니다. 사업자 등록증과 정산 계좌가 관리자 승인을 받으면 정산 가능 상태로 변경됩니다.</li></ul></li><li><p>정산 계좌 정보</p><ul><li><strong>정산계좌 등록</strong><span>&nbsp;</span>: 입력한 정보와 통장 사본 이미지 정보가 일치하도록 입력해주세요.</li></ul></li><li><p>사업자 등록 정보</p><ul><li>사업자 등록증 등록 : 입력한 정보와 사업자 등록증 이미지, 통신 판매업 신고 이미지가 일치하도록 입력해주세요.</li></ul></li></ul>', '2022-03-30 04:37:15.375', '2022-03-31 05:16:31.766', '/mypage/settlement', 'settlement'),
	(9, 'seller', '상점설정', ' ', 1, '<ul><li><p>상점명</p><ul><li>상점명 변경하기 : 상점명을 입력합니다. 설정된 상점명은 구매자와 방송인에게 보여집니다.</li></ul></li><li><p>배송비 정책 :</p><ul><li>배송비정책 생성하기 : 클릭시 배송비 정책을 생성하는 팝업창이 뜹니다.</li><li>배송그룹명 : 배송 그룹명을 클릭하면 등록한 배송 정보를 볼 수 있습니다.</li><li>연결된 상품 : 해당 배송 그룹에 연결된 상품 갯수를 보여줍니다.</li><li>삭제 : X 버튼을 누르시면 해당 그룹이 삭제됩니다. (삭제 후 복구 불가)</li></ul></li><li><p>배송비 정책 생성</p><ul><li><p><strong>배송 그룹명</strong><span>&nbsp;</span>: 해당 배송그룹에 대한 배송그룹명을 지정하여 관리할 수 있습니다.</p></li><li><p><strong>배송비 계산기준 :</strong></p><p>해당 배송그룹으로 지정된 상품을 주문할 때 배송비 계산조건을 설정할 수 있습니다</p><ol><li><p><strong>묶음계산 - 묶음배송 :</strong><span>&nbsp;</span>같은 배송그룹 내 상품을 구매하면 묶음배송되어 배송비는 한번만 부과됩니다.</p></li><li><p><strong>개별계산 - 개별배송 :</strong><span>&nbsp;</span>같은 배송그룹 내 상품을 구매하면 개별배송되어 상품당 배송비를 부과합니다.</p></li><li><p><strong>무료계산 - 묶음 배송 :</strong><span>&nbsp;</span>같은 배송그룹 내 상품을 구매할 경우 모두 무료배송으로 묶음배송됩니다.</p></li></ol><p>*** 주의 :** 서로 다른 배송그룹의 상품을 구매할 경우 각각 상품의 배송그룹 정책에 맞추어 배송비가 부과됩니다.</p></li><li><p><strong>배송비 추가 설정 :</strong>&nbsp; 해당 배송그룹의 상품과 함께 무료계산-묶음배송 그룹의 상품을 구매한 경우 배송비 처리에 대한 설정입니다.&nbsp;&nbsp;해당 배송그룹에는 기본 배송비가 있으나 무료계산-묶음배송 그룹의 상품과 함께 구매할 경우 무료배송처리를 원한다면 체크 후 기본 항목에 체크하면 기본배송비가 무료처리됩니다.</p></li><li><p><strong>반송지 :</strong>&nbsp; 배송그룹이 여러개라고 하더라도 반송지 설정은 기본 배송그룹에서만 설정할 수 있습니다.</p></li><li><p>배송 옵션 추가하기</p></li><li><p><strong>배송 설정명</strong><span>&nbsp;</span>: 해당 배송 옵션 이름을 입력합니다. 등록된 배송 옵션을 구분할 수 있습니다.</p></li><li><p><strong>배송 방법</strong><span>&nbsp;</span>: 배송조건에 따른 배송방법을 설정할 수 있습니다. 기본은 택배이며 화물배송,직접수령 등 변경가능합니다. 또한 선착불 결제도 설정 가능합니다.</p></li><li><p><strong>기본 배송비 :</strong>&nbsp; 헤당 배송 조건에 대한 기본 배송비를 설정할 수 있습니다. 무료 및 고정, 수량별, 무게별, 금액별 등 설정 가능합니다.</p></li></ul></li></ul>', '2022-03-30 04:38:09.160', '2022-03-31 05:16:38.473', '/mypage/shopinfo', 'shopinfo');

-- CreateTable
CREATE TABLE `KkshowShoppingTab` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `carousel` JSON NOT NULL,
    `goodsOfTheWeek` JSON NOT NULL,
    `newLineUp` JSON NOT NULL,
    `popularGoods` JSON NOT NULL,
    `banner` JSON NOT NULL,
    `recommendations` JSON NOT NULL,
    `reviews` JSON NOT NULL,
    `keywords` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `KkshowShoppingTab` (
    `id`,
    `carousel`,
    `goodsOfTheWeek`,
    `newLineUp`,
    `popularGoods`,
    `recommendations`,
    `reviews`,
    `keywords`,
    `banner`
) VALUES (
    1,
    '[{"linkUrl": "https://k-kmarket.com/","imageUrl": "https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/kkshow-shopping-carousel-images/1649138023040_banner-1.png","description": ""},{"linkUrl": "https://k-kmarket.com/","imageUrl": "https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/kkshow-shopping-carousel-images/1649138031589_banner-2.png","description": ""},{"linkUrl": "https://k-kmarket.com/","imageUrl": "https://project-lc-dev-test.s3.ap-northeast-2.amazonaws.com/kkshow-shopping-carousel-images/1649138041072_banner-3.png","description": ""}]',
    '[{"name":"백종원의 3대천왕 출연 속초 닭강정 (반반)","linkUrl":"https://k-kmarket.com/goods/view?no=97","imageUrl":"https://k-kmarket.com/data/goods/1/2021/12/_temp_16385092718881large.jpg","normalPrice":18000,"discountedPrice":17000},{"name":"오늘한끼 다이어트 도시락 시즌1 6팩","linkUrl":"https://k-kmarket.com/goods/view?no=163","imageUrl":"https://k-kmarket.com/data/goods/1/2022/01/_temp_16426661552946large.png","normalPrice":26900,"discountedPrice":""},{"name":"진국보감 양념이 맛있는 한돈 갈비찜","linkUrl":"https://k-kmarket.com/goods/view?no=93","imageUrl":"https://k-kmarket.com/data/goods/1/2022/01/93_temp_16425785866489view.jpg?1648788341602","normalPrice":15000,"discountedPrice":14000},{"name":"경기 고양시 삼부자 수제만두 모음전","linkUrl":"https://k-kmarket.com/goods/view?no=66","imageUrl":"https://k-kmarket.com/data/goods/1/2021/09/_temp_16324652408352view.png?1648788535953","normalPrice":20000,"discountedPrice":17000},{"name":"맛있게 매운 삼형제 양념 쭈꾸미","linkUrl":"https://k-kmarket.com/goods/view?no=137","imageUrl":"https://k-kmarket.com/data/goods/1/2021/12/_temp_16405271386492view.jpg?1648788689164","normalPrice":8900,"discountedPrice":""}]',
    '[{"name":"촉촉하고 맛있는 전주 수제 떡갈비 4팩","linkUrl":"https://k-kmarket.com/goods/view?no=179","imageUrl":"https://k-kmarket.com/data/goods/1/2022/02/_temp_16449135102313view.jpg?1648788776517","normalPrice":"12200","discountedPrice":"8200"},{"name":"돼지 등뼈와 우거지가 가득한 뼈해장국","linkUrl":"https://k-kmarket.com/goods/view?no=178","imageUrl":"https://k-kmarket.com/data/goods/1/2022/02/_temp_16448938223899view.png?1648788833581","normalPrice":"9000","discountedPrice":"8000"},{"name":"술 안주로 딱인 양념닭불고기 350g","linkUrl":"https://k-kmarket.com/goods/view?no=173","imageUrl":"https://k-kmarket.com/data/goods/1/2022/02/172_temp_16445574046693view.png?1648788901902","normalPrice":"6000","discountedPrice":"5000"},{"name":"곱창, 닭발, 불고기 토핑의 신개념 떡볶이","linkUrl":"https://k-kmarket.com/goods/view?no=96","imageUrl":"https://k-kmarket.com\\t/data/goods/1/2022/02/_temp_16445577295678view.png?1648788956061","normalPrice":"28000","discountedPrice":"21900"},{"name":"국물이 끝내주는 가마솥 돈코츠 라멘 3종 (3인분)","linkUrl":"https://k-kmarket.com/goods/view?no=174","imageUrl":"https://k-kmarket.com/data/goods/1/2022/02/_temp_16445600385895view.jpg?1648789045790","normalPrice":"11000","discountedPrice":"9900"}]',
    '[{"name":"식스레시피 감바스 밀키트 캠핑 요리","linkUrl":"https://k-kmarket.com/goods/view?no=160","imageUrl":"https://k-kmarket.com/data/goods/1/2022/01/_temp_16425756271098view.jpg?1648789112287","normalPrice":17000,"discountedPrice":14900},{"name":"오동통한 100% 한돈 수제 소세지","linkUrl":"https://k-kmarket.com/goods/view?no=138","imageUrl":"https://k-kmarket.com\\t/data/goods/1/2021/12/_temp_16405277754983view.jpg?1648789180126","normalPrice":3900,"discountedPrice":""},{"name":"맛있게 매콤한 닭꼬치 중꼬지 200g","linkUrl":"https://k-kmarket.com/goods/view?no=170","imageUrl":"https://k-kmarket.com/data/goods/1/2022/02/_temp_16444793818531view.jpg?1648789317857","normalPrice":4900,"discountedPrice":""},{"name":"오늘한끼 부산 초량 시장 불백 돼지불고기","linkUrl":"https://k-kmarket.com/goods/view?no=168","imageUrl":"https://k-kmarket.com/data/goods/1/2022/01/168_2022012017444012.png?1648789354867","normalPrice":7900,"discountedPrice":""},{"name":"내조국국밥 술 안주로 탁월한 모듬순대","linkUrl":"https://k-kmarket.com/goods/view?no=143","imageUrl":"https://k-kmarket.com/data/goods/1/2022/01/_temp_16415379643705view.jpg?1648789411842","normalPrice":11000,"discountedPrice":10000}]',
    '[{"name":"식스레시피 고추잡채 밀키트 (2인분)","linkUrl":"https://k-kmarket.com/goods/view?no=153","imageUrl":"https://k-kmarket.com/data/goods/1/2022/01/_temp_16425729124837view.jpg?1648789493046","normalPrice":14900,"discountedPrice":11170},{"name":"몽모랑시 타트체리 저분자 콜라겐 스틱 20g x 30포","linkUrl":"https://k-kmarket.com/goods/view?no=88","imageUrl":"https://k-kmarket.com/data/goods/1/2021/12/_temp_16385029186483view.png?1648789550534","normalPrice":24900,"discountedPrice":""},{"name":"오늘한끼 다이어트 한돈 소시지 (저칼로리)","linkUrl":"https://k-kmarket.com/goods/view?no=167","imageUrl":"https://k-kmarket.com/data/goods/1/2022/01/_temp_16426670960515view.png?1648789608183","normalPrice":3900,"discountedPrice":""}]',
    '[{"title":"떡갈비 맛있어요","rating":5,"linkUrl":"https://k-kmarket.com/board/view?id=goods_review&seq=10","contents":"떡갈비 맛있어요!! 구워서 햄버거빵 사이에 넣어 먹었는데 불고기버거 먹는 맛이 났어요 \\n밥이랑 먹어도 맛있을거같아요 다음에 또 살게요!!","imageUrl":"https://k-kmarket.com/data/board/goods_review/873dfd04f466d76f27e88e482633934c1310364.jpg","createDate":"2022-03-24"},{"title":"양도 많고 맛있어요","rating":5,"linkUrl":"https://k-kmarket.com/board/view?id=goods_review&seq=6","contents":"한번 사먹고 너무 맛있어서 또 샀네요 ㅋㅋ\\n\\n가격 대비 가성비 좋아요\\n\\n쭈꾸미 식감도 좋고 밥 볶아 먹으니 꿀맛입니다\\n\\n많이 맵지는 않은데 맵찔이라면 마요네즈 추가 필수\\n\\n번창하세요~","imageUrl":"https://k-kmarket.com/data/board/goods_review/761167a21b74945284840126978ac0611424122.jpg","createDate":"2022-03-25"},{"title":"유명한 예스 닭강정 ","rating":"5","linkUrl":"https://k-kmarket.com/board/view?id=goods_review&seq=2","contents":"티비에서 방송하는걸 본적 있던 예스닭강정\\n\\n\\n\\n이번에 라이브커머스로 소개되자마자 예전 기억이 떠오르면서 구매하게 됐습니다\\n\\n\\n\\n\\n\\n일단 기본적으로 닭강정입니다\\n\\n\\n\\n네, 실패할수가 없다는 말이죠\\n\\n\\n\\n다만 뼈있는 닭강정이 아니라 순살 닭강정입니다\\n\\n\\n\\n네, 먹기가 편하다는거죠\\n\\n\\n\\n기본적으로 닭강정들은 먹을때 따로 뎁히지 않고 차갑게 된 상태에서 먹는게 국룰입니다\\n\\n\\n\\n다만 예스닭강정의 경우 순살 닭강정이다 보니 차갑게 먹는것보다 전자레인지에 살짝 뎁히는편이 더 좋았습니다\\n\\n\\n\\n1분은 좀 과했고, 30초정도가 딱 좋았네요\\n\\n\\n\\n세일즈포인트중 하나가 공기층이 같이 있어서 부들부들한 식감이었는데, 30초 뎁히니까 딱 부드러우면서 쫄깃하고 달콤한 닭강정 최적의 맛이 나왔습니다\\n\\n\\n\\n블랙닭강정의 경우는 일단 신기해서 같이 시켜봤는데요.\\n\\n\\n\\n일단 생각하는 맛은 아닙니다.\\n\\n\\n\\n춘장이 들어가있기는 한데, 그렇다고 짜장맛은 아니구요\\n\\n\\n\\n기본적인 닭강정맛에서 매운맛을 조금 더 덜어내고, 달짝한 맛이 추가됐습니다\\n\\n\\n\\n그리고 춘장이 들어가서 소스가 일반 닭강정보다 약간 꾸덕한 느낌이 듭니다. 춘장맛은 일부러 찾으려고 하지 않으면 잘 느껴지지는 않고, 꾸덕함과 달짝한 맛이 더 추가됐다고 생각하시면 되겠습니다\\n\\n\\n\\n그리고 먹는다고 이빨이 까매지지는 않았습니다\\n\\n\\n\\n색다른 닭강정이 먹고 싶다면 한번쯤 도전해볼만 합니다. 기본 닭강정에서 지나치게 바뀌진 않으면서 다른맛이 납니다\\n\\n\\n\\n\\n\\n결론 - 닭강정은 항상 맛있다. 존..맛 ","imageUrl":"https://i.ibb.co/Qbm6Lyp/Kakao-Talk-20211221-194813657.jpg","createDate":"2021-12-21"},{"title":"배송이 잘못왔는데 대처가 너무 만족스럽습니다.","rating":"5","linkUrl":"https://k-kmarket.com/board/view?id=goods_review&seq=4","contents":"배송이 잘못왔는데 대처가 너무 만족스럽습니다.","imageUrl":"https://phinf.pstatic.net/checkout.phinf/20220123_210/1642904591443WBJrD_JPEG/review-attachment-7eab1102-c0fb-4276-8eb5-bad83ff536b6.jpeg?type=w640","createDate":"2022-01-23"}]',
    '[{"theme":"한식","imageUrl":"https://lc-project.s3.ap-northeast-2.amazonaws.com/kkshow-shopping-keywords-theme-images/1648450101822_keyword.png","keywords":[{"keyword":"쵸단"},{"keyword":"만두"},{"keyword":"굴림만두"},{"keyword":"오꾸밥"},{"keyword":"닭불갈비"},{"keyword":"홍봉자만두"}]},{"theme":"양식","imageUrl":"https://lc-project.s3.ap-northeast-2.amazonaws.com/kkshow-shopping-keywords-theme-images/1648450101822_keyword.png","keywords":[{"keyword":"파스타"},{"keyword":"곰"},{"keyword":"호랑이"},{"keyword":"이름대로"},{"keyword":"김광석"},{"keyword":"명예"}]}]',
    '{"linkUrl":"https://k-kmarket.com/board/?id=event","message":"신규가입하고 3000원","imageUrl":"https://lc-project.s3.ap-northeast-2.amazonaws.com/kkshow-shopping-banner-images/1648512619378_coupon.png"}'
);

-- CreateIndex
CREATE FULLTEXT INDEX `Broadcaster_userNickname_idx` ON `Broadcaster`(`userNickname`);

-- CreateIndex
CREATE FULLTEXT INDEX `Goods_goods_name_idx` ON `Goods`(`goods_name`);
