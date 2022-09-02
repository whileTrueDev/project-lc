/* eslint-disable no-irregular-whitespace */
import * as dayjs from 'dayjs';
import { Goods, Prisma } from '.prisma/client';

/** 상품 공통정보 */
export const common_contents = `<p>​<span class="notion-enable-hover" style="border-width: 0px; border-style: solid; box-sizing: border-box; border-color: var(--chakra-colors-gray-200); overflow-wrap: break-word; -webkit-user-drag: none; overflow: visible; font-family: inherit; font-size: inherit; color: inherit; display: inline; vertical-align: baseline; margin: 0px; padding: 0px;"><strong>교환 및 반품이 가능한 경우<br></strong></span>- 상품을 공급 받으신 날로부터 7일이내 단, 가전제품의&nbsp;&nbsp;경우 포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우에는 교환/반품이 불가능합니다.<br>- 공급받으신 상품 및 용역의 내용이 표시.광고 내용과&nbsp;&nbsp;다르거나 다르게 이행된 경우에는 공급받은 날로부터 3월이내, 그사실을 알게 된 날로부터 30일이내</p><p><span class="notion-enable-hover" style="border-width: 0px; border-style: solid; box-sizing: border-box; border-color: var(--chakra-colors-gray-200); overflow-wrap: break-word; -webkit-user-drag: none; overflow: visible; font-family: inherit; font-size: inherit; color: inherit; display: inline; vertical-align: baseline; margin: 0px; padding: 0px; letter-spacing: var(--chakra-letterSpacings-tight);"><strong>교환 및 반품이 불가능한 경우<br></strong></span><span style="border-width: 0px; border-style: solid; box-sizing: border-box; border-color: var(--chakra-colors-gray-200); overflow-wrap: break-word; -webkit-user-drag: none; overflow: visible; font-family: inherit; font-size: inherit; color: inherit; display: inline; vertical-align: baseline; margin: 0px; padding: 0px; letter-spacing: var(--chakra-letterSpacings-tight);">- 고객님의 책임 있는 사유로 상품등이 멸실 또는 훼손된 경우. 단, 상품의 내용을 확인하기 위하여&nbsp;&nbsp;포장 등을 훼손한 경우는 제외<br>- 포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우&nbsp;&nbsp;(예 : 가전제품, 식품, 음반 등, 단 액정화면이 부착된 노트북, LCD모니터, 디지털 카메라 등의 불량화소에&nbsp;&nbsp;따른 반품/교환은 제조사 기준에 따릅니다.)<br>- 고객님의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우 단, 화장품등의 경우 시용제품을&nbsp;&nbsp;제공한 경우에 한 합니다.<br>- 시간의 경과에 의하여 재판매가 곤란할 정도로 상품등의 가치가 현저히 감소한 경우- 복제가 가능한 상품등의 포장을 훼손한 경우&nbsp;&nbsp;(자세한 내용은 고객만족센터 1:1 E-MAIL상담을 이용해 주시기 바랍니다.)<br>※ 고객님의 마음이 바뀌어 교환, 반품을 하실 경우 상품반송 비용은 고객님께서 부담하셔야 합니다.&nbsp;&nbsp;(색상 교환, 사이즈 교환 등 포함)</span></p>`;

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
export const testsellerData2: Prisma.SellerCreateInput = {
  email: 'testseller2@gmail.com',
  name: 'test판매자2',
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
        shipping_set_name: '택배',
        default_yn: 'Y',
        shippingOptions: {
          create: [
            {
              shipping_set_type: 'std',
              shipping_opt_type: 'fixed',
              shippingCost: {
                create: {
                  shipping_area_name: '대한민국',
                  shipping_cost: 2500,
                },
              },
            },
            {
              shipping_set_type: 'add',
              shipping_opt_type: 'fixed',
              shippingCost: {
                create: {
                  shipping_area_name: '제주특별자치도',
                  shipping_cost: 5000,
                },
              },
            },
          ],
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
  option_title: '만두 종류',
  option1: '왕만두',
  price: 2500,
  consumer_price: 3000,
  supply: { create: { stock: 40 } },
};
/** 상품기본옵션2 */
export const secondOption: Omit<Prisma.GoodsOptionsCreateInput, 'goods'> = {
  default_option: 'n',
  option_title: '만두 종류',
  option1: '매운 만두',
  price: 2500,
  consumer_price: 3000,
  supply: { create: { stock: 40 } },
};

/** 더미상품 타입 */
export type DummyGoodsDataType = Pick<
  Goods,
  'goods_name' | 'summary' | 'contents' | 'searchKeyword'
> & {
  confirmation?: Omit<Prisma.GoodsConfirmationCreateInput, 'goods'>;
};

/** 더미상품목록 */
export const dummyGoodsList: DummyGoodsDataType[] = [
  {
    goods_name: '[음바쿠 - 김치찌개] 김치 김치찌개 김치찜 ',
    contents: `<p style="text-align: center;">​<br></p><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/40ea972af742dccfd6f563a838711c8a1754332.gif" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="40ea972af742dccfd6f563a838711c8a1754332.gif" data-file-size="0" origin-size="860,711" data-origin="," style="" data-index="0" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/7c7b59f605505c18b7e4222744f965861754412.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="7c7b59f605505c18b7e4222744f965861754412.jpg" data-file-size="0" origin-size="860,1764" data-origin="," style="" data-index="2" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" data-file-size="0" origin-size="860,1405" data-origin="," style="" data-index="3" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/1ac2a620f28d1d520029aa58512f6c571751302.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="1ac2a620f28d1d520029aa58512f6c571751302.jpg" data-file-size="0" origin-size="770,2072" data-origin="," style="" data-index="4" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" data-file-size="0" origin-size="770,2756" data-origin="," style="" data-index="5" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" data-file-size="0" origin-size="770,2765" data-origin="," style="" data-index="6" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/51de362fcf91bb18695ec36ee6adf2141752112.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="51de362fcf91bb18695ec36ee6adf2141752112.jpg" data-file-size="0" origin-size="770,2255" data-origin="," style="" data-index="7" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/b92e711bae42c3502341d071caf7cf971752262.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="b92e711bae42c3502341d071caf7cf971752262.jpg" data-file-size="0" origin-size="770,1730" data-origin="," style="" data-index="8" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/ef82b201d8b5c98b968bc89e149594251752352.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="ef82b201d8b5c98b968bc89e149594251752352.jpg" data-file-size="0" origin-size="770,1554" data-origin="," style="" data-index="9" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/78807de3e5326f0de2ded9e814bb05501752412.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="78807de3e5326f0de2ded9e814bb05501752412.jpg" data-file-size="0" origin-size="770,2419" data-origin="," style="" data-index="10" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/252c7f6619b268c590826e36842dab6d1754142.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="252c7f6619b268c590826e36842dab6d1754142.jpg" data-file-size="0" origin-size="642,2612" data-origin="," style="" data-index="11" data-rotatex="" data-rotatey=""></figure></div><p style="text-align: center;">​</p>`,
    summary: '집에서 끓인 보리차의 풍미를 산뜻하게 담았어요~',
    confirmation: { status: 'confirmed' },
    searchKeyword: '키워드테스트',
  },
  {
    goods_name: '[크크쇼X루야나] 떡 찹쌀떡 망개떡 ',
    contents: `<p style="text-align: center;">​<br></p><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/40ea972af742dccfd6f563a838711c8a1754332.gif" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="40ea972af742dccfd6f563a838711c8a1754332.gif" data-file-size="0" origin-size="860,711" data-origin="," style="" data-index="0" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/7c7b59f605505c18b7e4222744f965861754412.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="7c7b59f605505c18b7e4222744f965861754412.jpg" data-file-size="0" origin-size="860,1764" data-origin="," style="" data-index="2" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" data-file-size="0" origin-size="860,1405" data-origin="," style="" data-index="3" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/1ac2a620f28d1d520029aa58512f6c571751302.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="1ac2a620f28d1d520029aa58512f6c571751302.jpg" data-file-size="0" origin-size="770,2072" data-origin="," style="" data-index="4" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" data-file-size="0" origin-size="770,2756" data-origin="," style="" data-index="5" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" data-file-size="0" origin-size="770,2765" data-origin="," style="" data-index="6" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/51de362fcf91bb18695ec36ee6adf2141752112.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="51de362fcf91bb18695ec36ee6adf2141752112.jpg" data-file-size="0" origin-size="770,2255" data-origin="," style="" data-index="7" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/b92e711bae42c3502341d071caf7cf971752262.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="b92e711bae42c3502341d071caf7cf971752262.jpg" data-file-size="0" origin-size="770,1730" data-origin="," style="" data-index="8" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/ef82b201d8b5c98b968bc89e149594251752352.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="ef82b201d8b5c98b968bc89e149594251752352.jpg" data-file-size="0" origin-size="770,1554" data-origin="," style="" data-index="9" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/78807de3e5326f0de2ded9e814bb05501752412.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="78807de3e5326f0de2ded9e814bb05501752412.jpg" data-file-size="0" origin-size="770,2419" data-origin="," style="" data-index="10" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/252c7f6619b268c590826e36842dab6d1754142.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="252c7f6619b268c590826e36842dab6d1754142.jpg" data-file-size="0" origin-size="642,2612" data-origin="," style="" data-index="11" data-rotatex="" data-rotatey=""></figure></div><p style="text-align: center;">​</p>`,
    summary: '국내산 갈치연육과 고급 실꼬리돔 연육을 아낌없이 넣어 만든 프리미엄 어묵',
    confirmation: { status: 'waiting' },
    searchKeyword: '키워드테스트,키워드2',
  },
  {
    goods_name: '[다이어트] 다이어트 다이어트식품 다이어트빵',
    contents: `<p style="text-align: center;">​<br></p><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/40ea972af742dccfd6f563a838711c8a1754332.gif" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="40ea972af742dccfd6f563a838711c8a1754332.gif" data-file-size="0" origin-size="860,711" data-origin="," style="" data-index="0" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/7c7b59f605505c18b7e4222744f965861754412.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="7c7b59f605505c18b7e4222744f965861754412.jpg" data-file-size="0" origin-size="860,1764" data-origin="," style="" data-index="2" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" data-file-size="0" origin-size="860,1405" data-origin="," style="" data-index="3" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/1ac2a620f28d1d520029aa58512f6c571751302.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="1ac2a620f28d1d520029aa58512f6c571751302.jpg" data-file-size="0" origin-size="770,2072" data-origin="," style="" data-index="4" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" data-file-size="0" origin-size="770,2756" data-origin="," style="" data-index="5" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" data-file-size="0" origin-size="770,2765" data-origin="," style="" data-index="6" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/51de362fcf91bb18695ec36ee6adf2141752112.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="51de362fcf91bb18695ec36ee6adf2141752112.jpg" data-file-size="0" origin-size="770,2255" data-origin="," style="" data-index="7" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/b92e711bae42c3502341d071caf7cf971752262.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="b92e711bae42c3502341d071caf7cf971752262.jpg" data-file-size="0" origin-size="770,1730" data-origin="," style="" data-index="8" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/ef82b201d8b5c98b968bc89e149594251752352.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="ef82b201d8b5c98b968bc89e149594251752352.jpg" data-file-size="0" origin-size="770,1554" data-origin="," style="" data-index="9" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/78807de3e5326f0de2ded9e814bb05501752412.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="78807de3e5326f0de2ded9e814bb05501752412.jpg" data-file-size="0" origin-size="770,2419" data-origin="," style="" data-index="10" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/252c7f6619b268c590826e36842dab6d1754142.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="252c7f6619b268c590826e36842dab6d1754142.jpg" data-file-size="0" origin-size="642,2612" data-origin="," style="" data-index="11" data-rotatex="" data-rotatey=""></figure></div><p style="text-align: center;">​</p>`,
    summary: '국내산 갈치연육과 고급 실꼬리돔 연육을 아낌없이 넣어 만든 프리미엄 어묵',
    confirmation: { status: 'confirmed' },
    searchKeyword: '칼치조림맛있겠다',
  },
  {
    goods_name: '[음바쿠 - 만두] 김치만두 고기만두 왕만두',
    contents: `<p style="text-align: center;">​<br></p><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/40ea972af742dccfd6f563a838711c8a1754332.gif" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="40ea972af742dccfd6f563a838711c8a1754332.gif" data-file-size="0" origin-size="860,711" data-origin="," style="" data-index="0" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/7c7b59f605505c18b7e4222744f965861754412.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="7c7b59f605505c18b7e4222744f965861754412.jpg" data-file-size="0" origin-size="860,1764" data-origin="," style="" data-index="2" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="1befdf44184c8a8dc9cf00b747ce6f0b1754492.gif" data-file-size="0" origin-size="860,1405" data-origin="," style="" data-index="3" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/1ac2a620f28d1d520029aa58512f6c571751302.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="1ac2a620f28d1d520029aa58512f6c571751302.jpg" data-file-size="0" origin-size="770,2072" data-origin="," style="" data-index="4" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="912a1492548cb0f3b8fdeaf086d3bf971751402.jpg" data-file-size="0" origin-size="770,2756" data-origin="," style="" data-index="5" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="82d12c0e3be17d25f08a941abc20fd3f1751592.jpg" data-file-size="0" origin-size="770,2765" data-origin="," style="" data-index="6" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/51de362fcf91bb18695ec36ee6adf2141752112.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="51de362fcf91bb18695ec36ee6adf2141752112.jpg" data-file-size="0" origin-size="770,2255" data-origin="," style="" data-index="7" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/b92e711bae42c3502341d071caf7cf971752262.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="b92e711bae42c3502341d071caf7cf971752262.jpg" data-file-size="0" origin-size="770,1730" data-origin="," style="" data-index="8" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/ef82b201d8b5c98b968bc89e149594251752352.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="ef82b201d8b5c98b968bc89e149594251752352.jpg" data-file-size="0" origin-size="770,1554" data-origin="," style="" data-index="9" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/78807de3e5326f0de2ded9e814bb05501752412.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="78807de3e5326f0de2ded9e814bb05501752412.jpg" data-file-size="0" origin-size="770,2419" data-origin="," style="" data-index="10" data-rotatex="" data-rotatey=""></figure></div><div class="se-component se-image-container __se__float-center" contenteditable="false"><figure style="margin: auto;"><img src="https://k-kmarket.com/data/editor/252c7f6619b268c590826e36842dab6d1754142.jpg" alt="" data-rotate="" data-proportion="true" data-size="," data-align="center" data-percentage="auto,auto" data-file-name="252c7f6619b268c590826e36842dab6d1754142.jpg" data-file-size="0" origin-size="642,2612" data-origin="," style="" data-index="11" data-rotatex="" data-rotatey=""></figure></div><p style="text-align: center;">​</p>`,
    summary: '집에서 끓인 보리차의 풍미를 산뜻하게 담았어요~',
    confirmation: { status: 'confirmed' },
    searchKeyword: '끓이지않은보리차',
  },
  {
    goods_name: '테스트판매자2의 상품',
    contents: `<p style="text-align: center;">​테스트 상품입니다</p>`,
    summary: '테스트판매자2의 상품, 테스트판매자2의 상품',
    confirmation: { status: 'confirmed' },
    searchKeyword: 'a,b,c',
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
  messageSetting: {
    create: {
      fanNick: '테스트팬닉',
      levelCutOffPoint: 30000,
      ttsSetting: 'full',
    },
  },
  liveShoppingPurchaseMessage: {
    createMany: {
      data: [
        {
          broadcasterEmail: 'testbc@gmail.com',
          price: 30000,
          text: 'test',
          nickname: '테스트닉네임1',
        },
        {
          broadcasterEmail: 'testbc@gmail.com',
          price: 33900,
          text: 'test2',
          nickname: '테스트닉네임1',
        },
        {
          broadcasterEmail: 'testbc@gmail.com',
          price: 12000,
          text: 'test',
          nickname: '테스트닉네임2',
        },
        {
          broadcasterEmail: 'testbc@gmail.com',
          price: 40000,
          text: 'test',
          nickname: '테스트닉네임3',
        },
        {
          broadcasterEmail: 'testbc@gmail.com',
          price: 30000,
          text: 'test',
          nickname: '테스트닉네임4',
        },
        {
          broadcasterEmail: 'testbc@gmail.com',
          price: 30000,
          giftFlag: true,
          text: 'test',
          nickname: '테스트닉네임4',
        },
        {
          broadcasterEmail: 'testbc@gmail.com',
          price: 12000,
          text: '선물 테스트',
          nickname: '테스트닉네임5',
          giftFlag: true,
        },
        {
          broadcasterEmail: 'testbc@gmail.com',
          price: 14000,
          text: 'test',
          nickname: '테스트닉네임5',
        },
        {
          broadcasterEmail: 'testbc@gmail.com',
          price: 14000,
          text: 'test',
          nickname: '비회원',
        },
        {
          broadcasterEmail: 'testbc@gmail.com',
          price: 14000,
          text: 'test',
          loginFlag: false,
          nickname: '테스트닉네임5',
        },
      ],
    },
  },
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
