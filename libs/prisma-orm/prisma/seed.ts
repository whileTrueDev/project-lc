import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const common_contents = `
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
      seller: { connect: { email: seller.email } },
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
        create: { status: 'confirmed', firstmallGoodsConnectionId: 41 },
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
      seller: { connect: { email: seller.email } },
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
      confirmation: {
        create: { status: 'rejected' },
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
      confirmation: {
        create: { status: 'confirmed', firstmallGoodsConnectionId: 42 },
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
