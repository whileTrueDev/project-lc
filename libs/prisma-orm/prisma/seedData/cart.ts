import { defaultOption, secondOption } from './dummyData';

export const cartSample = {
  customerId: 1,
  tempUserId: null,
  goodsId: 1,
  shippingGroupId: 1,
  options: {
    create: {
      name: defaultOption.option_title,
      value: defaultOption.option1,
      quantity: 1,
      normalPrice: '2000',
      discountPrice: '2000',
      weight: 500,
      goodsOption: { connect: { id: 1 } },
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
  shippingGroupId: 1,
  options: {
    create: [
      {
        name: defaultOption.option_title,
        value: defaultOption.option1,
        quantity: 1,
        normalPrice: '3000',
        discountPrice: '2500',
        weight: 500,
        goodsOption: { connect: { id: 7 } },
      },
      {
        name: secondOption.option_title,
        value: secondOption.option1,
        quantity: 1,
        normalPrice: '3000',
        discountPrice: '2500',
        weight: 500,
        goodsOption: { connect: { id: 8 } },
      },
    ],
  },
  support: {
    create: {
      message: 'support message',
      nickname: 'nickname',
      broadcasterId: 1,
    },
  },
};
