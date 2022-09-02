import { OrderProcessStep, Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type DummyOrderFundamentalDataProps = {
  orderCode: string;
};
export const getDummyOrderFundamentalData = ({
  orderCode,
}: DummyOrderFundamentalDataProps): Prisma.OrderCreateInput => {
  return {
    orderCode,
    orderPrice: 123123,
    paymentPrice: 123123,
    recipientName: '크크쇼1',
    recipientPhone: '010-2323-2323',
    recipientEmail: 'reccipient@gasdf.com',
    recipientAddress: '서울특별시 종로구 무슨로 13',
    recipientDetailAddress: '494호',
    recipientPostalCode: '1234',
    ordererName: '주문자1',
    ordererPhone: '010-2023-4848',
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
    goodsName: '테스트상품명',
    name: '맛',
    value: '매운맛',
    quantity: 1,
    normalPrice: 5000,
    discountPrice: 4000,
    goodsOptionId: 1,
  },
  {
    goodsName: '테스트상품명',
    name: '맛',
    value: '순한맛',
    quantity: 1,
    normalPrice: 5000,
    discountPrice: 4000,
    goodsOptionId: 2,
  },
];

type CreateDummyOrderOpts = DummyOrderFundamentalDataProps & {
  withSupportData?: boolean;
  step: OrderProcessStep;
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

  const foundedOrderShipping = await prisma.orderShipping.findFirst({
    where: { orderId: order.id },
  });
  await prisma.order.update({
    where: { id: order.id },
    data: {
      orderItems: {
        updateMany: {
          where: { orderId: order.id },
          data: { orderShippingId: foundedOrderShipping?.id },
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

export const normalOrder: Prisma.OrderCreateInput = {
  customer: { connect: { id: 1 } },
  ...getDummyOrderFundamentalData({
    orderCode: '20220613154618378F9hUFA',
  }),
  shippings: {
    create: [
      {
        shippingCost: '2500',
        shippingCostPayType: 'prepay',
        shippingGroupId: 1,
        shippingMethod: 'delivery',
        shippingSetId: 1,
      },
    ],
  },
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
        options: { create: options.map((opt) => ({ ...opt, step: 'paymentConfirmed' })) },
      };
    }),
  },
};

export const nonMemberOrder: Prisma.OrderCreateInput = {
  ...getDummyOrderFundamentalData({
    orderCode: '20220516165920231XeWaOv',
  }),
  nonMemberOrderFlag: true,
  shippings: {
    create: [
      {
        shippingCost: '2500',
        shippingCostPayType: 'prepay',
        shippingGroupId: 1,
        shippingMethod: 'delivery',
        shippingSetId: 1,
      },
    ],
  },
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

export const purchaseConfirmedOrder: Prisma.OrderCreateInput = {
  ...normalOrder,
  orderCode: '20220516141608459wupcUq',
  shippings: {
    create: [
      {
        shippingCost: '2500',
        shippingCostPayType: 'prepay',
        shippingGroupId: 1,
        shippingMethod: 'delivery',
        shippingSetId: 1,
      },
    ],
  },
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
            },
            {
              ...normalOrder.orderItems.create[0].options.create[1],
              step: 'purchaseConfirmed' as const,
            },
          ],
        },
      },
    ],
  },
};

export const shippingDoneOrder: Prisma.OrderCreateInput = {
  ...normalOrder,
  orderCode: '20220516144652907Hq1RMm',
  shippings: {
    create: [
      {
        shippingCost: '2500',
        shippingCostPayType: 'prepay',
        shippingGroupId: 1,
        shippingMethod: 'delivery',
        shippingSetId: 1,
      },
    ],
  },
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

export const orderExportReady: Prisma.OrderCreateInput = {
  customer: { connect: { id: 1 } },
  ...getDummyOrderFundamentalData({
    orderCode: '20220516154059927Mx-60e',
  }),
  shippings: {
    create: [
      {
        shippingCost: '2500',
        shippingCostPayType: 'prepay',
        shippingGroupId: 1,
        shippingMethod: 'delivery',
        shippingSetId: 1,
      },
    ],
  },
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
    orderCode: '20220516160437801fUqXGi',
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
          quantity: 1,
        },
      },
    },
  });
};

export const createDummyOrderWithExchange = async (): Promise<void> => {
  // 교환요청 연결된 주문(배송중 상태)
  const { orderId, orderItemId, orderItemOptionId } = await createDummyOrder({
    orderCode: '20220613140004196eUx-Ul',
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
          quantity: 1,
        },
      },
      images: { create: [{ imageUrl: 'https://dummyimage.com/300' }] },
    },
  });
};

// 반품요청 연결된 주문(배송완료 상태)
export const createDummyOrderWithReturn = async (): Promise<void> => {
  const { orderId, orderItemId, orderItemOptionId } = await createDummyOrder({
    orderCode: '20220614104151331pKmvWX',
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
          quantity: 1,
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
            quantity: 1,
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
            quantity: 1,
            status: 'purchaseConfirmed',
            orderItemId: order2.orderItemId,
            orderItemOptionId: order2.orderItemOptionId,
          },
        ],
      },
    },
  });
};

async function connectDummyOrderToOrderShipping(orderId: number): Promise<void> {
  const orderShipping = await prisma.orderShipping.findFirst({
    where: { orderId },
  });
  await prisma.order.update({
    where: { id: orderId },
    data: {
      orderItems: {
        updateMany: {
          where: { orderId },
          data: { orderShippingId: orderShipping?.id },
        },
      },
    },
  });
}

export const createDummyOrderData = async (): Promise<void> => {
  const order1 = await prisma.order.create({ data: normalOrder });
  await connectDummyOrderToOrderShipping(order1.id);
  const order2 = await prisma.order.create({ data: nonMemberOrder });
  await connectDummyOrderToOrderShipping(order2.id);
  const order3 = await prisma.order.create({ data: purchaseConfirmedOrder });
  await connectDummyOrderToOrderShipping(order3.id);
  const order4 = await prisma.order.create({ data: shippingDoneOrder });
  await connectDummyOrderToOrderShipping(order4.id);
  const order5 = await prisma.order.create({ data: orderExportReady });
  await connectDummyOrderToOrderShipping(order5.id);
};
