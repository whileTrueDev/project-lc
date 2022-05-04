export const normalOrder = {
  // customerId: 1,
  customer: { connect: { id: 1 } },
  orderCode: 'dummy-order-1-asdfasd',
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
  orderItems: {
    create: [
      {
        goodsId: 1,
        options: [
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
        ],
        shippingCost: 0,
        shippingGroupId: 1,
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
  orderPrice: 123123,
  orderCode: 'nonmember-order-dummy',
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
  nonMemberOrderFlag: true,
  nonMemberOrderPassword: 'test',
  orderItems: {
    create: [
      {
        goodsId: 1,
        options: [
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
        ],
        shippingCost: 0,
        shippingGroupId: 1,
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
