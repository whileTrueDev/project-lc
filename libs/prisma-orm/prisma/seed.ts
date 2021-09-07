import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const common_contents = '상품공통정보';
const image = '';
const testSellerEmail = 'a1919361@gmail.com';
const testSellerData = {
  email: testSellerEmail,
  name: 'testSeller',
  password:
    '$argon2i$v=19$m=4096,t=3,p=1$97nVwdfXR9h8Wu38n5YuvQ$w5XgpncJVDAxURkmyJyMzDLMe2axEV6WT1PoSxNYqjY', // asdfasdf!
};

async function main() {
  let seller = await prisma.seller.findUnique({
    where: { email: testSellerData.email },
  });

  if (!seller) {
    seller = await prisma.seller.create({
      data: testSellerData,
    });
  }

  // 테스트 상품 1 + 옵션 + 재고 데이터 생성
  await prisma.goods.create({
    data: {
      sellerId: seller.id,
      goods_name: 'testGoods1',
      summary: '테스트상품1',
      common_contents,
      image,
      options: {
        create: [
          {
            default_option: 'y',
            price: 10000,
            consumer_price: 3000,
            supply: { create: { stock: 10 } },
          },
        ],
      },
      confirmation: {
        create: { status: 'rejected' },
      },
    },
    include: { options: { include: { supply: true } } },
  });
  // 테스트 상품 2 + 옵션 + 재고 데이터 생성
  await prisma.goods.create({
    data: {
      sellerId: seller.id,
      goods_name: 'testGoods2',
      summary: '테스트상품2',
      common_contents,
      image,
      options: {
        create: [
          {
            default_option: 'y',
            price: 5000,
            consumer_price: 4000,
            supply: { create: { stock: 20 } },
          },
          {
            price: 6000,
            consumer_price: 5000,
            supply: { create: { stock: 3 } },
          },
        ],
      },
    },
    include: { options: { include: { supply: true } } },
  });
  // 테스트 상품 3 + 옵션 + 재고 데이터 생성
  await prisma.goods.create({
    data: {
      sellerId: seller.id,
      goods_name: 'testGoods3',
      summary: '테스트상품3',
      common_contents,
      image,
      options: {
        create: [
          {
            default_option: 'y',
            price: 500,
            consumer_price: 30,
            supply: { create: { stock: 40 } },
          },
        ],
      },
    },
    include: { options: { include: { supply: true } } },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
