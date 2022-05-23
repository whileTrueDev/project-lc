import { OrderProcessStep, Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type DummyOrderFundamentalDataProps = {
  orderCode: string;
  step?: OrderProcessStep;
};
export const getDummyOrderFundamentalData = ({
  orderCode,
  step,
}: DummyOrderFundamentalDataProps): Prisma.OrderCreateInput => {
  return {
    orderCode,
    step,
    orderPrice: 123123,
    paymentPrice: 0,
    recipientName: '받는사람이름',
    recipientPhone: '01023232323',
    recipientEmail: 'reccipient@gasdf.com',
    recipientAddress: '서울특별시 종로구 무슨로 13',
    recipientDetailAddress: '494호',
    recipientPostalCode: '1234',
    ordererName: '주문자이름',
    ordererPhone: '01020234848',
    ordererEmail: 'orderer@gmao.com',
    memo: '빠른배송요망',
  };
};

const dummyOrderItemData = [
  {
    goodsId: 1,
    shippingCost: 0,
    shippingGroupId: 1,
  },
  {
    goodsId: 2,
    shippingCost: 0,
    shippingGroupId: 1,
  },
];

const dummyOrderItemOptionData = [
  {
    name: '맛',
    value: '매운맛',
    quantity: 1,
    normalPrice: 5000,
    discountPrice: 4000,
    goodsOptionId: 1,
  },
  {
    name: '맛',
    value: '순한맛',
    quantity: 1,
    normalPrice: 5000,
    discountPrice: 4000,
    goodsOptionId: 2,
  },
];

export const createDummyOrder = async ({
  orderCode,
  step,
}: DummyOrderFundamentalDataProps): Promise<{
  orderId: number;
  orderItemId: number;
  orderItemOptionId: number;
}> => {
  const order = await prisma.order.create({
    data: {
      customer: { connect: { id: 1 } },
      ...getDummyOrderFundamentalData({
        orderCode,
        step,
      }),
    },
  });

  const orderItem = await prisma.orderItem.create({
    data: {
      ...dummyOrderItemData[0],
      orderId: order.id,
    },
  });

  const orderItemOption = await prisma.orderItemOption.create({
    data: {
      orderItem: { connect: { id: orderItem.id } },
      name: '맛',
      value: '매운맛',
      quantity: 1,
      normalPrice: 5000,
      discountPrice: 4000,
      goodsOptionId: 1,
      step,
    },
  });
  return {
    orderId: order.id,
    orderItemId: orderItem.id,
    orderItemOptionId: orderItemOption.id,
  };
};

export const normalOrder = {
  customer: { connect: { id: 1 } },
  ...getDummyOrderFundamentalData({
    orderCode: 'dummy-order-1-asdfasd',
  }),
  orderItems: {
    create: [
      {
        ...dummyOrderItemData[0],
        options: dummyOrderItemOptionData,
      },
    ].map((item) => {
      const { options, ...rest } = item;
      return {
        ...rest,
        options: { create: options },
      };
    }),
  },
};

export const nonMemberOrder = {
  ...getDummyOrderFundamentalData({
    orderCode: 'nonmember-order-dummy',
  }),
  nonMemberOrderFlag: true,
  nonMemberOrderPassword: 'test',
  orderItems: {
    create: [
      {
        ...dummyOrderItemData[0],
        options: dummyOrderItemOptionData,
      },
    ].map((item) => {
      const { options, ...rest } = item;
      return {
        ...rest,
        options: { create: options },
      };
    }),
  },
};

export const purchaseConfirmedOrder = {
  ...normalOrder,
  orderCode: 'dummy-order-2-qwer',
  step: 'purchaseConfirmed' as const,
  purchaseConfirmationDate: new Date(),
  orderItems: {
    create: [
      {
        ...normalOrder.orderItems.create[0],
        goodsId: 2,
        options: {
          create: [
            {
              ...normalOrder.orderItems.create[0].options.create[0],
              step: 'purchaseConfirmed' as const,
              purchaseConfirmationDate: new Date(),
            },
            {
              ...normalOrder.orderItems.create[0].options.create[1],
              step: 'purchaseConfirmed' as const,
              purchaseConfirmationDate: new Date(),
            },
          ],
        },
      },
    ],
  },
};

export const shippingDoneOrder = {
  ...normalOrder,
  orderCode: 'dummy-order-3-zxcv',
  step: 'shippingDone' as const,
  orderItems: {
    create: [
      {
        ...normalOrder.orderItems.create[0],
        goodsId: 2,
        options: {
          create: [
            {
              ...normalOrder.orderItems.create[0].options.create[0],
              step: 'shippingDone' as const,
            },
            {
              ...normalOrder.orderItems.create[0].options.create[1],
              step: 'shippingDone' as const,
            },
          ],
        },
      },
    ],
  },
};

export const orderExportReady = {
  customer: { connect: { id: 1 } },
  ...getDummyOrderFundamentalData({
    orderCode: 'orderExportReady-for-exchange-return',
    step: 'exportReady',
  }),
  orderItems: {
    create: [
      {
        ...dummyOrderItemData[0],
        options: [
          {
            ...dummyOrderItemOptionData[0],
            step: 'exportReady' as const,
          },
        ],
      },
      {
        ...dummyOrderItemData[1],
        options: [
          {
            ...dummyOrderItemOptionData[1],
            step: 'exportReady' as const,
          },
        ],
      },
    ].map((item) => {
      const { options, ...rest } = item;
      return {
        ...rest,
        options: { create: options },
      };
    }),
  },
};

export const createDummyOrderWithCancellation = async (): Promise<void> => {
  // 주문취소 연결된 주문(입금확인된 상태)
  const { orderId, orderItemId, orderItemOptionId } = await createDummyOrder({
    orderCode: 'orderWithCancellation',
    step: 'paymentConfirmed',
  });
  // 주문취소데이터
  await prisma.orderCancellation.create({
    data: {
      cancelCode: 'testcancel',
      orderId,
      reason: '테스트 주문취소',
      items: {
        create: {
          orderItemId,
          orderItemOptionId,
          amount: 1,
        },
      },
    },
  });
};

export const createDummyOrderWithExchange = async (): Promise<void> => {
  // 교환요청 연결된 주문(배송중 상태)
  const { orderId, orderItemId, orderItemOptionId } = await createDummyOrder({
    orderCode: 'orderWithExchange',
    step: 'shipping',
  });

  // 교환요청데이터
  await prisma.exchange.create({
    data: {
      exchangeCode: 'testexchange',
      orderId,
      reason: '테스트 주문취소',
      exchangeItems: {
        create: {
          orderItemId,
          orderItemOptionId,
          amount: 1,
        },
      },
      images: { create: [{ imageUrl: 'https://dummyimage.com/300' }] },
    },
  });
};

// 반품요청 연결된 주문(배송완료 상태)
export const createDummyOrderWithReturn = async (): Promise<void> => {
  const { orderId, orderItemId, orderItemOptionId } = await createDummyOrder({
    orderCode: 'orderWithReturn',
    step: 'shippingDone',
  });
  // 교환요청데이터
  await prisma.return.create({
    data: {
      returnCode: 'testreturn',
      orderId,
      reason: '테스트 주문취소',
      items: {
        create: {
          orderItemId,
          orderItemOptionId,
          amount: 1,
        },
      },
      images: { create: [{ imageUrl: 'https://dummyimage.com/300' }] },
    },
  });
};
