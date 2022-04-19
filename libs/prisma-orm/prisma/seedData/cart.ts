export const cartSample = {
  customerId: 1,
  tempUserId: null,
  goodsId: 1,
  shippingCost: '2500',
  shippingCostIncluded: false,
  shippingGroupId: 1,
  options: {
    create: {
      name: '맛',
      value: '매운맛',
      quantity: 1,
      normalPrice: '2000',
      discountPrice: '2000',
      weight: 500,
      // goodsOptionId: 1,
    },
  },
  support: {
    create: {
      message: 'support message',
      nickname: 'nickname',
      broadcasterId: 1,
    },
  },
};

export const tempUserCartItemSample = {
  customerId: null,
  tempUserId: 'temp-user-id',
  goodsId: 1,
  shippingCost: '2500',
  shippingCostIncluded: false,
  shippingGroupId: 1,
  options: {
    create: {
      name: '맛',
      value: '순한맛',
      quantity: 1,
      normalPrice: '3000',
      discountPrice: '2500',
      weight: 500,
      // goodsOptionId: 1,
    },
  },
  support: {
    create: {
      message: 'support message',
      nickname: 'nickname',
      broadcasterId: 1,
    },
  },
};
