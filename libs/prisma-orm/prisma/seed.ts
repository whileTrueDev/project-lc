import {
  Administrator,
  Broadcaster,
  BroadcasterPromotionPage,
  Goods,
  GoodsInfo,
  PrismaClient,
  Seller,
  SellerContacts,
  ShippingGroup,
} from '@prisma/client';
import {
  defaultOption,
  defaultSellCommissionData,
  DummyGoodsDataType,
  dummyGoodsList,
  dummyImageUrlList,
  dummyLiveShoppingData,
  testadminData,
  testBroadcasterData,
  testsellerData,
  testsellerExtraData,
} from './dummyData';

const prisma = new PrismaClient();

/** 테스트관리자 계정 생성 */
async function createAdminAccount(): Promise<Administrator> {
  return prisma.administrator.create({
    data: testadminData,
  });
}

export type SellerAccountType = Seller & {
  shippingGroups: ShippingGroup[];
  goodsCommonInfo: GoodsInfo[];
  SellerContacts: SellerContacts[];
};
/** 테스트 판매자 계정 & 판매자 기본 공통정보, 정산계정, 연락처, 배송그룹 생성 */
async function createSellerAccount(): Promise<SellerAccountType> {
  const {
    sellerShop,
    goodsInfo,
    sellerSettlementAccount,
    sellerContacts,
    shippingGroup,
  } = testsellerExtraData;
  // 판매자 계정 생성
  const seller = await prisma.seller.create({
    data: {
      ...testsellerData,
      // 판매자 상점정보 생성
      sellerShop: { create: sellerShop },
      // 판매자 공통정보 생성
      goodsCommonInfo: { create: goodsInfo },
      // 판매자 정산계정 생성
      sellerSettlementAccount: { create: sellerSettlementAccount },
      // 판매자 연락처 생성
      SellerContacts: { create: sellerContacts },
      // 판매자 기본배송비그룹 생성
      shippingGroups: { create: shippingGroup },
    },
  });

  // 테스트 판매자 계정 & 판매자 기본 공통정보, 정산계정, 연락처, 배송그룹 정보 리턴
  return prisma.seller.findUnique({
    where: { id: seller.id },
    include: { shippingGroups: true, goodsCommonInfo: true, SellerContacts: true },
  });
}

/** 테스트방송인 생성 */
async function createBroadcaster(): Promise<Broadcaster> {
  return prisma.broadcaster.create({
    data: testBroadcasterData,
  });
}

/** 방송인홍보페이지 생성 */
let kkmarketCatalogCode = 11;
async function createBroadcasterPromotionPage(
  broadcasterId: number,
): Promise<BroadcasterPromotionPage> {
  const tempCatalogUrl = `https://k-kmarket.com/goods/catalog?code=00${kkmarketCatalogCode}`;
  kkmarketCatalogCode += 1;
  return prisma.broadcasterPromotionPage.create({
    data: {
      broadcasterId,
      url: tempCatalogUrl, // 임시로 크크마켓 카테고리 링크
    },
  });
}

/** 상품홍보아이템 생성 */
async function createProductPromotion(
  broadcasterPromotionPageId: number,
  goodsId: number,
): Promise<any> {
  return prisma.productPromotion.create({
    data: {
      broadcasterPromotionPageId,
      goodsId,
    },
  });
}
/** 판매 수수료 기본값 설정 */
const generateDefaultSellCommission = async (): Promise<void> => {
  await prisma.sellCommission.upsert({
    create: defaultSellCommissionData,
    update: defaultSellCommissionData,
    where: { id: 1 },
  });
};

/** 더미 상품 데이터 생성 */
async function createDummyGoods(
  seller: SellerAccountType,
  goods: DummyGoodsDataType,
): Promise<Goods> {
  const { goods_name, summary, confirmation } = goods;
  const sellerDefaultShippingGroup = seller.shippingGroups[0];
  const sellerDefaultCommonInfo = seller.goodsCommonInfo[0];
  const createdGoods = await prisma.goods.create({
    data: {
      seller: { connect: { email: seller.email } },
      ShippingGroup: {
        connect: { id: sellerDefaultShippingGroup.id },
      },
      GoodsInfo: {
        connect: { id: sellerDefaultCommonInfo.id },
      },
      goods_name,
      summary,
      image: {
        create: dummyImageUrlList.map((url, idx) => ({
          cut_number: idx,
          image: url,
        })),
      },
      options: { create: [defaultOption] },
      confirmation: { create: confirmation },
    },
  });
  return createdGoods;
}

/** 더미 라이브쇼핑 생성 */
async function createDummyLiveShopping(
  seller: SellerAccountType,
  broadcaster: Broadcaster,
  goods: Goods,
): Promise<void> {
  await prisma.liveShopping.create({
    data: {
      seller: { connect: { id: seller.id } },
      goods: {
        connect: { id: goods.id },
      },
      broadcaster: { connect: { id: broadcaster.id } },
      sellerContacts: { connect: { id: seller.SellerContacts[0].id } },
      ...dummyLiveShoppingData,
    },
  });
}

/** 시드 메인 함수 */
async function main(): Promise<void> {
  // 판매 수수료 기본값 설정
  await generateDefaultSellCommission();

  // 관리자 계정 생성
  await createAdminAccount();

  // 판매자 계정 생성
  const seller = await createSellerAccount();

  // 테스트방송인 데이터 생성
  const testbroadcaster = await createBroadcaster();

  // 더미 상품 데이터 생성
  await createDummyGoods(seller, dummyGoodsList[0]);
  await createDummyGoods(seller, dummyGoodsList[1]);
  await createDummyGoods(seller, dummyGoodsList[2]);
  const goods4 = await createDummyGoods(seller, dummyGoodsList[3]);

  // 테스트상품4의 라이브쇼핑 생성
  await createDummyLiveShopping(seller, testbroadcaster, goods4);

  // 더미 상품홍보페이지 생성
  const promotionPage = await createBroadcasterPromotionPage(testbroadcaster.id);
  // 더미 상품홍보 아이템 생성
  await createProductPromotion(promotionPage.id, goods4.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
