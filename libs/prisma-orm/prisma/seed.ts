import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const common_contents = '상품공통정보';
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
      seller: {
        connect: { id: seller.id },
      },
      goods_name: 'testGoods1',
      summary: '테스트상품1',
      common_contents,
      image: {
        create: [
          {
            cut_number: 1,
            image: 'https://picsum.photos/301/300',
          },
          {
            cut_number: 2,
            image: 'https://picsum.photos/300/300',
          },
          {
            cut_number: 3,
            image: 'https://picsum.photos/300/301',
          },
          {
            cut_number: 4,
            image: 'https://picsum.photos/301/301',
          },
          {
            cut_number: 5,
            image: 'https://picsum.photos/302/301',
          },
        ],
      },
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
      ShippingGroup: {
        create: {
          baseAddress: '반송지 주소',
          detailAddress: '반송지 주소 상세',
          postalCode: '12345',
          shipping_group_name: '배송그룹이름',
          seller: {
            connect: { id: seller.id },
          },
          shippingSets: {
            create: {
              shipping_set_name: '배송세트이름',
              shippingOptions: {
                create: {
                  shippingCost: {
                    create: {
                      shipping_area_name: 'shipping_area_name',
                      shipping_cost: 2500,
                    },
                  },
                },
              },
            },
          },
        },
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
      image: {
        create: {
          cut_number: 1,
          image: 'test2.png',
        },
      },
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
      image: {
        create: {
          cut_number: 1,
          image: 'test3.png',
        },
      },
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
