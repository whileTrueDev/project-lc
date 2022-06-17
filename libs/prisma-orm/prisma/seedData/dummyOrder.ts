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

type CreateDummyOrderOpts = DummyOrderFundamentalDataProps & {
  withSupportData?: boolean;
};
export const createDummyOrder = async ({
  orderCode,
  step,
  withSupportData,
}: CreateDummyOrderOpts): Promise<{
  orderId: number;
  orderItemId: number;
  orderItemOptionId: number;
}> => {
  const order = await prisma.order.create({
    data: {
      customer: { connect: { id: 1 } },
      supportOrderIncludeFlag: !!withSupportData,
      ...getDummyOrderFundamentalData({
        orderCode,
        step,
      }),
    },
  });

  const orderShipping = await prisma.orderShipping.create({
    data: {
      orderId: order.id,
      shippingCost: 2500,
      shippingMethod: 'delivery',
      shippingGroupId: 1,
      shippingSetId: 1,
    },
  });

  const orderItem = await prisma.orderItem.create({
    data: {
      ...dummyOrderItemData[0],
      orderId: order.id,
      orderShippingId: orderShipping.id,
      support: {
        create: !withSupportData
          ? undefined
          : {
              broadcasterId: 1,
              liveShoppingId: 1,
              message: '테스트 메시지',
              nickname: '테스터',
            },
      },
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
      goodsOption: { connect: { id: 1 } },
      goodsName: '예스닭강정',
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
  ...getDummyOrderFundamentalData({
    orderCode: 'dummy-order-1-asdfasd',
  }),
};

export const purchaseConfirmedOrder = {
  ...normalOrder,
  orderCode: 'dummy-order-2-qwer',
  step: 'purchaseConfirmed' as const,
};

export const shippingDoneOrder = {
  ...normalOrder,
  orderCode: 'dummy-order-3-zxcv',
  step: 'shippingDone' as const,
};

export const orderExportReady = {
  ...getDummyOrderFundamentalData({
    orderCode: 'orderExportReady-for-exchange-return',
    step: 'exportReady',
  }),
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

/** 방송인 후원이 포함된 주문 */
export const createDummyOrderWithSupport = async (): Promise<void> => {
  await createDummyOrder({
    orderCode: 'orderWithSupport',
    step: 'shippingDone',
    withSupportData: true,
  });
  await createDummyOrder({
    orderCode: 'orderWithSupport2',
    step: 'shippingDone',
    withSupportData: true,
  });
  await createDummyOrder({
    orderCode: 'orderWithSupport3',
    step: 'shippingDone',
    withSupportData: true,
  });
  const order1 = await createDummyOrder({
    orderCode: 'orderWithSupport4',
    step: 'purchaseConfirmed',
    withSupportData: true,
  });
  await prisma.export.create({
    data: {
      orderId: order1.orderId,
      exportCode: 'E_TEST_01',
      deliveryCompany: '테스트배송사',
      deliveryNumber: '12341234',
      buyConfirmSubject: 'system',
      buyConfirmDate: new Date(),
      shippingDoneDate: new Date(),
      exportDate: new Date('2022-06-05'),
      sellerId: 1,
      items: {
        create: [
          {
            amount: 1,
            status: 'purchaseConfirmed',
            orderItemId: order1.orderItemId,
            orderItemOptionId: order1.orderItemOptionId,
          },
        ],
      },
    },
  });
  const order2 = await createDummyOrder({
    orderCode: 'orderWithSupport5',
    step: 'purchaseConfirmed',
    withSupportData: true,
  });
  await prisma.export.create({
    data: {
      orderId: order2.orderId,
      exportCode: 'E_TEST_02',
      deliveryCompany: '테스트배송사2',
      deliveryNumber: '0987654321',
      buyConfirmSubject: 'system',
      buyConfirmDate: new Date(),
      shippingDoneDate: new Date(),
      exportDate: new Date('2022-06-05'),
      sellerId: 1,
      items: {
        create: [
          {
            amount: 1,
            status: 'purchaseConfirmed',
            orderItemId: order2.orderItemId,
            orderItemOptionId: order2.orderItemOptionId,
          },
        ],
      },
    },
  });
};

export const createDummyOrderData = async (): Promise<void> => {
  await createDummyOrder({
    orderCode: normalOrder.orderCode,
    step: normalOrder.step,
  });
  await createDummyOrder({
    orderCode: purchaseConfirmedOrder.orderCode,
    step: purchaseConfirmedOrder.step,
  });
  await createDummyOrder({
    orderCode: shippingDoneOrder.orderCode,
    step: shippingDoneOrder.step,
  });
  await createDummyOrder({
    orderCode: orderExportReady.orderCode,
    step: orderExportReady.step,
  });
};
