import * as dayjs from 'dayjs';
import { Goods, Prisma } from '.prisma/client';

/** 상품 공통정보 */
export const common_contents = `
<p>상품결제정보</p>
<br>
<p>
고액결제의 경우 안전을 위해 카드사에서 확인전화를 드릴 수도 있습니다.
확인과정에서 도난 카드의 사용이나 타인 명의의 주문등 정상적인 주문이 아니라고 판단될 경우 임의로 주문을 보류 또는 취소할 수 있습니다.
</p>
<br>
<p>
무통장 입금은 상품 구매 대금은 PC뱅킹, 인터넷뱅킹, 텔레뱅킹 혹은 가까운 은행에서 직접 입금하시면 됩니다.
주문시 입력한 입금자명과 실제입금자의 성명이 반드시 일치하여야 하며, 7일 이내로 입금을 하셔야 하며 입금되지 않은 주문은 자동취소 됩니다.
</p>

<br>
<p>
배송정보
</p>

<ul>
<li>- 배송 방법 : 택배</li>
<li>- 배송 지역 : 전국지역</li>
<li>- 배송 비용 : ₩3,000</li>
<li>- 배송 기간 : 3일 ~ 7일</li>
<li>- 배송 안내 : 산간벽지나 도서지방은 별도의 추가금액을 지불하셔야 하는 경우가 있습니다.</li>
</ul>
<p>고객님께서 주문하신 상품은 입금 확인후 배송해 드립니다.</p>
<p>다만, 상품종류에 따라서 상품의 배송이 다소 지연될 수 있습니다.</p>
`;

export const TEST_ADMIN_EMAIL = 'testadmin@gmail.com';
export const TEST_SELLER_EMAIL = 'testseller@gmail.com';
export const TEST_BROADCASTER_EMAIL = 'testbc@gmail.com';
// 비밀번호 : asdfasdf!
export const COMMON_DUMMY_PASSWORD =
  '$argon2i$v=19$m=4096,t=3,p=1$97nVwdfXR9h8Wu38n5YuvQ$w5XgpncJVDAxURkmyJyMzDLMe2axEV6WT1PoSxNYqjY';

/** 관리자 생성 데이터 */
export const testadminData: Prisma.AdministratorCreateInput = {
  email: TEST_ADMIN_EMAIL,
  password: COMMON_DUMMY_PASSWORD,
  adminClass: 'super',
};

/** 테스트판매자 생성 데이터 */
export const testsellerData: Prisma.SellerCreateInput = {
  email: TEST_SELLER_EMAIL,
  name: 'test판매자',
  password: COMMON_DUMMY_PASSWORD,
};

/** 테스트판매자 연결 데이터 */
export const testsellerExtraData: {
  sellerShop: Omit<Prisma.SellerShopCreateInput, 'seller'>;
  goodsInfo: Omit<Prisma.GoodsInfoCreateInput, 'seller'>;
  sellerSettlementAccount: Omit<Prisma.SellerSettlementAccountCreateInput, 'seller'>;
  sellerContacts: Omit<Prisma.SellerContactsCreateInput, 'seller'>;
  shippingGroup: Omit<Prisma.ShippingGroupCreateInput, 'seller'>;
} = {
  sellerShop: { shopName: '테스트 판매자의 상점' },
  goodsInfo: { info_name: '기본', info_value: common_contents },
  sellerSettlementAccount: {
    bank: '농협',
    name: '테스트',
    number: '123456789',
    settlementAccountImageName: 'test',
  },
  sellerContacts: {
    email: 'testcontact@test.com',
  },
  shippingGroup: {
    baseAddress: '반송지 주소',
    detailAddress: '반송지 주소 상세',
    postalCode: '12345',
    shipping_group_name: '기본 배송 그룹',
    shippingSets: {
      create: {
        shipping_set_name: '배송세트이름',
        shippingOptions: {
          create: {
            shipping_opt_type: 'fixed',
            shippingCost: {
              create: {
                shipping_area_name: '대한민국',
                shipping_cost: 2500,
              },
            },
          },
        },
      },
    },
  },
};

/** 테스트방송인 생성 데이터 */
export const testBroadcasterData: Prisma.BroadcasterCreateInput = {
  email: TEST_BROADCASTER_EMAIL,
  password: COMMON_DUMMY_PASSWORD,
  overlayUrl: `/${TEST_BROADCASTER_EMAIL}`,
  userName: '음바쿠',
  userNickname: '음바쿠TV',
  avatar: 'https://picsum.photos/302/301',
};

/** 판매 수수료 기본값 설정 */
export const defaultSellCommissionData = {
  commissionDecimal: '0.05',
  commissionRate: '5',
};

/** 상품 사진 목록 */
export const dummyImageUrlList: string[] = [
  'https://k-kmarket.com/data/goods/1/2022/01/_temp_16415357317356large.jpg',
  'https://k-kmarket.com/data/goods/1/2022/01/_temp_16424958510161large.jpg',
  'https://k-kmarket.com/data/goods/1/2022/01/_temp_16424958557441large.jpg',
  'https://k-kmarket.com/data/goods/1/2022/01/_temp_16424958594854large.jpg',
  'https://k-kmarket.com/data/goods/1/2022/01/_temp_16424958630476large.jpg',
];

/** 상품기본옵션 */
export const defaultOption: Omit<Prisma.GoodsOptionsCreateInput, 'goods'> = {
  default_option: 'y',
  option_title: '',
  option1: '',
  price: 500,
  consumer_price: 30,
  supply: { create: { stock: 40 } },
};

/** 더미상품 타입 */
export type DummyGoodsDataType = Pick<Goods, 'goods_name' | 'summary' | 'contents'> & {
  confirmation?: Omit<Prisma.GoodsConfirmationCreateInput, 'goods'>;
};

/** 더미상품목록 */
export const dummyGoodsList: DummyGoodsDataType[] = [
  {
    goods_name: '[음바쿠 - 김치찌개] 김치 김치찌개 김치찜 ',
    contents: `<div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/40ea972af742dccfd6f563a838711c8a1754332.gif" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="0" data-file-name="40ea972af742dccfd6f563a838711c8a1754332.gif" data-file-size="0" origin-size="860,711" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/252c7f6619b268c590826e36842dab6d1754142.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="10" data-file-name="252c7f6619b268c590826e36842dab6d1754142.jpg" data-file-size="0" origin-size="642,2612" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/7c7b59f605505c18b7e4222744f965861754412.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="1" data-file-name="7c7b59f605505c18b7e4222744f965861754412.jpg" data-file-size="0" origin-size="860,1764" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="2" data-file-name="1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" data-file-size="0" origin-size="860,1405" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/1ac2a620f28d1d520029aa58512f6c571751302.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="3" data-file-name="1ac2a620f28d1d520029aa58512f6c571751302.jpg" data-file-size="0" origin-size="770,2072" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="4" data-file-name="912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" data-file-size="0" origin-size="770,2756" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="5" data-file-name="82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" data-file-size="0" origin-size="770,2765" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/51de362fcf91bb18695ec36ee6adf2141752112.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="6" data-file-name="51de362fcf91bb18695ec36ee6adf2141752112.jpg" data-file-size="0" origin-size="770,2255" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/b92e711bae42c3502341d071caf7cf971752262.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="7" data-file-name="b92e711bae42c3502341d071caf7cf971752262.jpg" data-file-size="0" origin-size="770,1730" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/ef82b201d8b5c98b968bc89e149594251752352.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="8" data-file-name="ef82b201d8b5c98b968bc89e149594251752352.jpg" data-file-size="0" origin-size="770,1554" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/78807de3e5326f0de2ded9e814bb05501752412.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="9" data-file-name="78807de3e5326f0de2ded9e814bb05501752412.jpg" data-file-size="0" origin-size="770,2419" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/252c7f6619b268c590826e36842dab6d1754142.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="11" data-file-name="252c7f6619b268c590826e36842dab6d1754142.jpg" data-file-size="0" origin-size="642,2612" data-origin="," style=""></figure></div>`,
    summary: '테스트상품1',
    confirmation: { status: 'confirmed', firstmallGoodsConnectionId: 41 },
  },
  {
    goods_name: '[크크쇼X루야나] 떡 찹쌀떡 망개떡 ',
    contents: `<div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/40ea972af742dccfd6f563a838711c8a1754332.gif" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="0" data-file-name="40ea972af742dccfd6f563a838711c8a1754332.gif" data-file-size="0" origin-size="860,711" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/252c7f6619b268c590826e36842dab6d1754142.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="10" data-file-name="252c7f6619b268c590826e36842dab6d1754142.jpg" data-file-size="0" origin-size="642,2612" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/7c7b59f605505c18b7e4222744f965861754412.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="1" data-file-name="7c7b59f605505c18b7e4222744f965861754412.jpg" data-file-size="0" origin-size="860,1764" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="2" data-file-name="1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" data-file-size="0" origin-size="860,1405" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/1ac2a620f28d1d520029aa58512f6c571751302.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="3" data-file-name="1ac2a620f28d1d520029aa58512f6c571751302.jpg" data-file-size="0" origin-size="770,2072" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="4" data-file-name="912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" data-file-size="0" origin-size="770,2756" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="5" data-file-name="82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" data-file-size="0" origin-size="770,2765" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/51de362fcf91bb18695ec36ee6adf2141752112.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="6" data-file-name="51de362fcf91bb18695ec36ee6adf2141752112.jpg" data-file-size="0" origin-size="770,2255" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/b92e711bae42c3502341d071caf7cf971752262.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="7" data-file-name="b92e711bae42c3502341d071caf7cf971752262.jpg" data-file-size="0" origin-size="770,1730" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/ef82b201d8b5c98b968bc89e149594251752352.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="8" data-file-name="ef82b201d8b5c98b968bc89e149594251752352.jpg" data-file-size="0" origin-size="770,1554" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/78807de3e5326f0de2ded9e814bb05501752412.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="9" data-file-name="78807de3e5326f0de2ded9e814bb05501752412.jpg" data-file-size="0" origin-size="770,2419" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/252c7f6619b268c590826e36842dab6d1754142.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="11" data-file-name="252c7f6619b268c590826e36842dab6d1754142.jpg" data-file-size="0" origin-size="642,2612" data-origin="," style=""></figure></div>`,
    summary: '테스트상품2',
    confirmation: { status: 'waiting' },
  },
  {
    goods_name: '[다이어트] 다이어트 다이어트식품 다이어트빵',
    contents: `<div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/40ea972af742dccfd6f563a838711c8a1754332.gif" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="0" data-file-name="40ea972af742dccfd6f563a838711c8a1754332.gif" data-file-size="0" origin-size="860,711" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/252c7f6619b268c590826e36842dab6d1754142.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="10" data-file-name="252c7f6619b268c590826e36842dab6d1754142.jpg" data-file-size="0" origin-size="642,2612" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/7c7b59f605505c18b7e4222744f965861754412.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="1" data-file-name="7c7b59f605505c18b7e4222744f965861754412.jpg" data-file-size="0" origin-size="860,1764" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="2" data-file-name="1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" data-file-size="0" origin-size="860,1405" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/1ac2a620f28d1d520029aa58512f6c571751302.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="3" data-file-name="1ac2a620f28d1d520029aa58512f6c571751302.jpg" data-file-size="0" origin-size="770,2072" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="4" data-file-name="912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" data-file-size="0" origin-size="770,2756" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="5" data-file-name="82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" data-file-size="0" origin-size="770,2765" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/51de362fcf91bb18695ec36ee6adf2141752112.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="6" data-file-name="51de362fcf91bb18695ec36ee6adf2141752112.jpg" data-file-size="0" origin-size="770,2255" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/b92e711bae42c3502341d071caf7cf971752262.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="7" data-file-name="b92e711bae42c3502341d071caf7cf971752262.jpg" data-file-size="0" origin-size="770,1730" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/ef82b201d8b5c98b968bc89e149594251752352.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="8" data-file-name="ef82b201d8b5c98b968bc89e149594251752352.jpg" data-file-size="0" origin-size="770,1554" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/78807de3e5326f0de2ded9e814bb05501752412.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="9" data-file-name="78807de3e5326f0de2ded9e814bb05501752412.jpg" data-file-size="0" origin-size="770,2419" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/252c7f6619b268c590826e36842dab6d1754142.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="11" data-file-name="252c7f6619b268c590826e36842dab6d1754142.jpg" data-file-size="0" origin-size="642,2612" data-origin="," style=""></figure></div>`,
    summary: '테스트상품3',
    confirmation: { status: 'confirmed', firstmallGoodsConnectionId: 42 },
  },
  {
    goods_name: '[음바쿠 - 만두] 김치만두 고기만두 왕만두',
    contents: `<div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/40ea972af742dccfd6f563a838711c8a1754332.gif" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="0" data-file-name="40ea972af742dccfd6f563a838711c8a1754332.gif" data-file-size="0" origin-size="860,711" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/252c7f6619b268c590826e36842dab6d1754142.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="10" data-file-name="252c7f6619b268c590826e36842dab6d1754142.jpg" data-file-size="0" origin-size="642,2612" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/7c7b59f605505c18b7e4222744f965861754412.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="1" data-file-name="7c7b59f605505c18b7e4222744f965861754412.jpg" data-file-size="0" origin-size="860,1764" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="2" data-file-name="1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" data-file-size="0" origin-size="860,1405" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/1ac2a620f28d1d520029aa58512f6c571751302.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="3" data-file-name="1ac2a620f28d1d520029aa58512f6c571751302.jpg" data-file-size="0" origin-size="770,2072" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="4" data-file-name="912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" data-file-size="0" origin-size="770,2756" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="5" data-file-name="82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" data-file-size="0" origin-size="770,2765" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/51de362fcf91bb18695ec36ee6adf2141752112.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="6" data-file-name="51de362fcf91bb18695ec36ee6adf2141752112.jpg" data-file-size="0" origin-size="770,2255" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/b92e711bae42c3502341d071caf7cf971752262.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="7" data-file-name="b92e711bae42c3502341d071caf7cf971752262.jpg" data-file-size="0" origin-size="770,1730" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/ef82b201d8b5c98b968bc89e149594251752352.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="8" data-file-name="ef82b201d8b5c98b968bc89e149594251752352.jpg" data-file-size="0" origin-size="770,1554" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/78807de3e5326f0de2ded9e814bb05501752412.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="9" data-file-name="78807de3e5326f0de2ded9e814bb05501752412.jpg" data-file-size="0" origin-size="770,2419" data-origin="," style=""></figure></div><div class="se-component se-image-container __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img src="https://k-kmarket.com/data/editor/252c7f6619b268c590826e36842dab6d1754142.jpg" alt="" data-rotate="" data-proportion="true" data-rotatex="" data-rotatey="" data-size="," data-align="none" data-percentage="auto,auto" data-index="11" data-file-name="252c7f6619b268c590826e36842dab6d1754142.jpg" data-file-size="0" origin-size="642,2612" data-origin="," style=""></figure></div>`,
    summary: '라이브쇼핑 연결',
    confirmation: { status: 'confirmed', firstmallGoodsConnectionId: 83 },
  },
];

const startDate = new Date();
startDate.setDate(startDate.getDate() - 7);
const endDate = new Date();
endDate.setDate(endDate.getDate() + 7);

export const dummyLiveShoppingData: Omit<
  Prisma.LiveShoppingCreateInput,
  'seller' | 'goods' | 'sellerContacts'
> = {
  broadcastStartDate: startDate.toISOString(),
  broadcastEndDate: endDate.toISOString(),
  sellStartDate: startDate.toISOString(),
  sellEndDate: endDate.toISOString(),
  liveShoppingName: '더미 라이브 쇼핑 제목',
  whiletrueCommissionRate: '5',
  broadcasterCommissionRate: '10',
  progress: 'confirmed',
};

export const dummyBroadcasterAddress: Prisma.BroadcasterAddressCreateInput = {
  address: '부산 금정구 장전온천천로 51 (테라스파크)',
  detailAddress: '313호',
  postalCode: '46291',
};

export const dummyBroadcasterChannel: Omit<
  Prisma.BroadcasterChannelCreateInput,
  'broadcaster'
> = {
  url: 'http://twitch.com',
};

export const dummyBroadcasterContacts: Prisma.BroadcasterContactsCreateInput[] = [
  {
    name: '나다',
    email: 'iamironman@onad.io',
    phoneNumber: '010-1234-1234',
    isDefault: true,
  },
  {
    name: '나아니다',
    email: 'youareironman@onad.io',
    phoneNumber: '010-9876-9876',
    isDefault: false,
  },
];

const sellerLastLoginDate = dayjs().add(-366, 'day').toDate();
const broadcasterLastLoginDate = dayjs().add(-335, 'day').toDate();

export const dummyLoginHistory: Prisma.LoginHistoryCreateInput[] = [
  {
    userEmail: 'testseller@gmail.com',
    userType: 'seller',
    method: 'PC',
    ip: '::1',
    country: 'ROK',
    city: 'Busan',
    device: 'Windows',
    ua: 'Mozilla/5.0 (Windows; U; Win98; en-US; rv:0.9.2) Gecko/20010725 Netscape6/6.1',
    createDate: sellerLastLoginDate,
  },
  {
    userEmail: 'testbc@gmail.com',
    userType: 'broadcaster',
    method: 'MOBILE',
    ip: '::1',
    country: 'ROK',
    city: 'Seoul',
    device: 'iPhone',
    ua: 'Mozilla/5.0 (Windows; U; Win98; en-US; rv:0.9.2) Gecko/20010725 Netscape6/6.1',
    createDate: broadcasterLastLoginDate,
  },
];
