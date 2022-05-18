import {
  Administrator,
  Broadcaster,
  BroadcasterPromotionPage,
  Customer,
  Goods,
  GoodsInfo,
  Prisma,
  PrismaClient,
  Seller,
  SellerContacts,
  ShippingGroup,
} from '@prisma/client';
import { cartSample, tempUserCartItemSample } from './seedData/cart';
import { dummyCustomer } from './seedData/customer';
import {
  defaultOption,
  defaultSellCommissionData,
  dummyBroadcasterAddress,
  dummyBroadcasterChannel,
  dummyBroadcasterContacts,
  DummyGoodsDataType,
  dummyGoodsList,
  dummyImageUrlList,
  dummyLiveShoppingData,
  dummyLoginHistory,
  testadminData,
  testBroadcasterData,
  testsellerData,
  testsellerExtraData,
} from './seedData/dummyData';
import {
  nonMemberOrder,
  normalOrder,
  orderExportReady,
  purchaseConfirmedOrder,
  shippingDoneOrder,
} from './seedData/dummyOrder';
import { createGoodsReview, createGoodsReview2 } from './seedData/goods-review';
import { kkshowMainSeedData } from './seedData/kkshowMain';
import { kkshowShoppingTabDummyData } from './seedData/kkshowShoppingTab';
import { termsData } from './seedData/terms';

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

/** 테스트소비자 생성 */
async function createCustomer(): Promise<Customer> {
  const customer = await prisma.customer.create({ data: dummyCustomer });
  await prisma.customerAddress.create({
    data: {
      title: '우리집',
      recipient: '테스트소비자',
      address: '부산',
      detailAddress: '장전온천천로detailAddress',
      postalCode: '12345',
      isDefault: true,
      customer: { connect: { id: customer.id } },
    },
  });
  return customer;
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
  const { goods_name, summary, confirmation, contents } = goods;
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
      contents,
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

/** 더미 방송인 주소 생성 */
async function createDummyBroadcasterAddress(broadcaster: Broadcaster): Promise<void> {
  await prisma.broadcasterAddress.create({
    data: {
      address: dummyBroadcasterAddress.address,
      detailAddress: dummyBroadcasterAddress.detailAddress,
      postalCode: dummyBroadcasterAddress.postalCode,
      broadcaster: { connect: { id: broadcaster.id } },
    },
  });
}

/** 더미 방송인 채널 생성 */
async function createDummyBroadcasterChannel(broadcaster: Broadcaster): Promise<void> {
  await prisma.broadcasterChannel.create({
    data: {
      url: dummyBroadcasterChannel.url,
      broadcaster: { connect: { id: broadcaster.id } },
    },
  });
}

/** 더미 방송인 연락처 생성 */
async function createDummyBroadcasterContacts(
  dummyData: Prisma.BroadcasterContactsCreateInput,
  broadcaster: Broadcaster,
): Promise<void> {
  await prisma.broadcasterContacts.create({
    data: {
      name: dummyData.name,
      email: dummyData.email,
      phoneNumber: dummyData.phoneNumber,
      isDefault: dummyData.isDefault,
      broadcaster: { connect: { id: broadcaster.id } },
    },
  });
}

async function createDummyLoginHistory(
  dummyData: Prisma.LoginHistoryCreateInput,
): Promise<void> {
  await prisma.loginHistory.create({
    data: {
      userEmail: dummyData.userEmail,
      userType: dummyData.userType,
      method: dummyData.method,
      ip: dummyData.ip,
      country: dummyData.country,
      city: dummyData.city,
      device: dummyData.device,
      ua: dummyData.ua,
      createDate: dummyData.createDate,
    },
  });
}

// 초기 약관 데이터 저장(없으면 약관페이지에 표시될 데이터가 없어서)
async function generateInitialTerms(): Promise<void> {
  await prisma.policy.createMany({
    data: termsData,
  });
}

// 크크쇼 메인 초기데이터 저장
async function generateInitialKkshowMainData(): Promise<void> {
  const kkshowMainData = await prisma.kkshowMain.findFirst();

  const dto = {
    carousel: kkshowMainSeedData.carousel.map((c) => JSON.parse(JSON.stringify(c))),
    trailer: JSON.parse(JSON.stringify(kkshowMainSeedData.trailer)),
    bestLive: kkshowMainSeedData.bestLive.map((l) => JSON.parse(JSON.stringify(l))),
    bestBroadcaster: kkshowMainSeedData.bestBroadcaster.map((b) =>
      JSON.parse(JSON.stringify(b)),
    ),
  };
  if (!kkshowMainData) {
    await prisma.kkshowMain.create({
      data: dto,
    });
  } else {
    await prisma.kkshowMain.update({
      where: { id: kkshowMainData.id },
      data: dto,
    });
  }
}

async function genereateInitialKkshowShoppingTabData(): Promise<void> {
  const kkshowShoppingTabData = await prisma.kkshowShoppingTab.findFirst();

  if (!kkshowShoppingTabData) {
    await prisma.kkshowShoppingTab.create({
      data: JSON.parse(JSON.stringify(kkshowShoppingTabDummyData)),
    });
  } else {
    await prisma.kkshowShoppingTab.update({
      where: { id: kkshowShoppingTabData.id },
      data: JSON.parse(JSON.stringify(kkshowShoppingTabDummyData)),
    });
  }
}

async function createCartItems(): Promise<void> {
  await prisma.cartItem.create({ data: cartSample });
  await prisma.cartItem.create({ data: tempUserCartItemSample });
}

async function createDummyOrderData(): Promise<void> {
  await prisma.order.create({ data: normalOrder });
  await prisma.order.create({ data: nonMemberOrder });
  await prisma.order.create({ data: purchaseConfirmedOrder });
  await prisma.order.create({ data: shippingDoneOrder });
  await prisma.order.create({ data: orderExportReady });
}

/** 시드 메인 함수 */
async function main(): Promise<void> {
  // 약관 데이터 저장
  await generateInitialTerms();
  // 크크쇼 메인 데이터 저장
  await generateInitialKkshowMainData();
  // 크크쇼 쇼핑탭 데이터 저장
  await genereateInitialKkshowShoppingTabData();

  // 판매 수수료 기본값 설정
  await generateDefaultSellCommission();

  // 관리자 계정 생성
  await createAdminAccount();

  // 판매자 계정 생성
  const seller = await createSellerAccount();

  // 소비자 계정 생성
  await createCustomer();

  // 테스트방송인 데이터 생성
  const testbroadcaster = await createBroadcaster();

  // 테스트방송인 주소 생성
  await createDummyBroadcasterAddress(testbroadcaster);
  // 테스트방송인 채널 생성
  await createDummyBroadcasterChannel(testbroadcaster);
  // 테스트 방송인 연락처 생성
  await createDummyBroadcasterContacts(dummyBroadcasterContacts[0], testbroadcaster);
  await createDummyBroadcasterContacts(dummyBroadcasterContacts[1], testbroadcaster);

  // 더미 로그인 기록 생성 (판매자-휴면)
  await createDummyLoginHistory(dummyLoginHistory[0]);
  // 더미 로그인 기록 생성 (방송인-휴면예정)
  await createDummyLoginHistory(dummyLoginHistory[1]);

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

  // 더미 카트 상품 생성
  await createCartItems();

  // 더미 주문데이터 생성
  await createDummyOrderData();

  // 더미 상품리뷰 생성
  await createGoodsReview(prisma);
  await createGoodsReview2(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
