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
// 비밀번호 : asdfasdf!
export const COMMON_DUMMY_PASSWORD =
  '$argon2i$v=19$m=4096,t=3,p=1$97nVwdfXR9h8Wu38n5YuvQ$w5XgpncJVDAxURkmyJyMzDLMe2axEV6WT1PoSxNYqjY';

/** 관리자 생성 데이터 */
export const testadminData: Prisma.SellerCreateInput = {
  email: TEST_ADMIN_EMAIL,
  name: 'test관리자',
  password: COMMON_DUMMY_PASSWORD,
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
  email: 'testBc@gmail.com',
  password: COMMON_DUMMY_PASSWORD,
  overlayUrl: '/test-broadcaster@gmail.com',
  userName: '테스트방송인이름',
  userNickname: '테스트방송인활동명',
};

/** 판매 수수료 기본값 설정 */
export const defaultSellCommissionData = {
  commissionDecimal: '0.05',
  commissionRate: '5',
};

/** 상품 사진 목록 */
export const dummyImageUrlList: string[] = [
  'https://picsum.photos/301/300',
  'https://picsum.photos/300/300',
  'https://picsum.photos/300/301',
  'https://picsum.photos/301/301',
  'https://picsum.photos/302/301',
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
export type DummyGoodsDataType = Pick<Goods, 'goods_name' | 'summary'> & {
  confirmation?: Omit<Prisma.GoodsConfirmationCreateInput, 'goods'>;
};

/** 더미상품목록 */
export const dummyGoodsList: DummyGoodsDataType[] = [
  {
    goods_name: 'testGoods1',
    summary: '테스트상품1',
    confirmation: { status: 'confirmed', firstmallGoodsConnectionId: 41 },
  },
  {
    goods_name: 'testGoods2',
    summary: '테스트상품2',
    confirmation: { status: 'waiting' },
  },
  {
    goods_name: 'testGoods3',
    summary: '테스트상품3',
    confirmation: { status: 'confirmed', firstmallGoodsConnectionId: 42 },
  },
  {
    goods_name: 'testGoods4 x 테스트방송인',
    summary: '라이브쇼핑 연결',
    confirmation: { status: 'confirmed', firstmallGoodsConnectionId: 68 },
  },
];

export const dummyLiveShoppingData: Omit<
  Prisma.LiveShoppingCreateInput,
  'seller' | 'goods' | 'sellerContacts'
> = {
  sellStartDate: new Date('2021-10-01 00:00:00.000'),
  sellEndDate: new Date(),
  whiletrueCommissionRate: '5',
  broadcasterCommissionRate: '10',
  progress: 'confirmed',
};
