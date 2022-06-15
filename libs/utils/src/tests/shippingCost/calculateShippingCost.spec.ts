import { LimitOrUnlimit } from '@prisma/client';
import {
  dummyShippingGroup,
  dummyShippingSet,
} from './calculateShippingCostInCartTable.spec';
import { createShippingOption } from './shippingOptions.spec';
import {
  calculateStdShippingCost,
  calculateAddShippingCost,
} from '../../lib/calculateShippingCost';

/**
    전국배송,
    기본배송비 : 고정 - 전국 2500,
    추가배송비 : 고정 - 제주 10000, 고정 - 강원도 5000
 */
const deliveryUnlimitShippingGroupData = {
  ...dummyShippingGroup,
  shippingSets: [
    {
      ...dummyShippingSet,
      shippingOptions: [
        createShippingOption({
          setType: 'std',
          optType: 'fixed',
          shippingCost: 2500,
        }),
        createShippingOption({
          setType: 'add',
          optType: 'fixed',
          shippingCost: 10000,
          shippingArea: '제주특별자치도',
        }),
        createShippingOption({
          setType: 'add',
          optType: 'fixed',
          shippingCost: 5000,
          shippingArea: '강원도',
        }),
      ],
    },
  ],
};
/**
    지역제한배송,
    기본배송비 : 고정 - 서울 3000, 고정 - 경기 3000
    추가배송비 : 없음
 */
const deliveryLimitShippingGroupData = {
  ...dummyShippingGroup,
  shippingSets: [
    {
      ...dummyShippingSet,
      delivery_limit: LimitOrUnlimit.limit, // 지역제한배송
      shippingOptions: [
        createShippingOption({
          setType: 'std',
          optType: 'fixed',
          shippingCost: 3000,
          shippingArea: '서울특별시',
        }),
        createShippingOption({
          setType: 'std',
          optType: 'fixed',
          shippingCost: 3000,
          shippingArea: '경기도',
        }),
      ],
    },
  ],
};

describe('주문페이지 주소에 따른 기본/추가 배송비(고정) 계산', () => {
  // 주문상품 총 개수, 총 가격
  const itemOption = { cnt: 1, amount: 4000 };
  describe('주소지가 제주인 경우', () => {
    const address = '제주특별자치도 서귀포시 대정읍 대한로 632';
    const postalCode = '63503';
    describe(' 전국배송, 기본배송비 : 고정 - 전국 2500, 추가배송비 : 고정 - 제주 10000, 고정 - 강원도 5000 적용시', () => {
      const shippingGroupData = deliveryUnlimitShippingGroupData;
      test('기본배송비는 2500원', () => {
        const cost = calculateStdShippingCost({
          address,
          shippingGroupData,
          itemOption,
        });
        expect(cost).toBe(2500);
      });
      test('추가배송비는 10000원', () => {
        const cost = calculateAddShippingCost({
          address,
          shippingGroupData,
          itemOption,
        });
        expect(cost).toBe(10000);
      });
    });

    describe('지역제한배송, 기본배송비 : 고정 - 서울 3000, 고정 - 경기 3000, 추가배송비 : 없음 적용시', () => {
      const shippingGroupData = deliveryLimitShippingGroupData;
      test('기본배송비는 null(배송지역이 아니므로)', () => {
        const cost = calculateStdShippingCost({
          address,
          shippingGroupData,
          itemOption,
        });
        expect(cost).toBe(null);
      });
      test('추가배송비는 0', () => {
        const cost = calculateAddShippingCost({
          address,
          shippingGroupData,
          itemOption,
        });
        expect(cost).toBe(0);
      });
    });
  });

  describe('주소지가 서울인 경우', () => {
    const address = '서울 동대문구 서울시립대로 5 (신답극동아파트)';
    const postalCode = '02592';

    describe(' 전국배송, 기본배송비 : 고정 - 전국 2500, 추가배송비 : 고정 - 제주 10000, 고정 - 강원도 5000 적용시', () => {
      const shippingGroupData = deliveryUnlimitShippingGroupData;
      test('기본배송비는 2500원', () => {
        const cost = calculateStdShippingCost({
          address,
          shippingGroupData,
          itemOption,
        });
        expect(cost).toBe(2500);
      });
      test('추가배송비는 0원', () => {
        const cost = calculateAddShippingCost({
          address,
          shippingGroupData,
          itemOption,
        });
        expect(cost).toBe(0);
      });
    });

    describe('지역제한배송, 기본배송비 : 고정 - 서울 3000, 고정 - 경기 3000, 추가배송비 : 없음 적용시', () => {
      const shippingGroupData = deliveryLimitShippingGroupData;
      test('기본배송비는 3000원', () => {
        const cost = calculateStdShippingCost({
          address,
          shippingGroupData,
          itemOption,
        });
        expect(cost).toBe(3000);
      });
    });
  });

  describe('주소지가 강원인 경우', () => {
    const address = '강원 동해시 강원남부로 4589 (동해시 하늘정원)';
    const postalCode = '25820';

    describe(' 전국배송, 기본배송비 : 고정 - 전국 2500, 추가배송비 : 고정 - 제주 10000, 고정 - 강원도 5000 적용시', () => {
      const shippingGroupData = deliveryUnlimitShippingGroupData;
      test('기본배송비는 2500원', () => {
        const cost = calculateStdShippingCost({
          address,
          shippingGroupData,
          itemOption,
        });
        expect(cost).toBe(2500);
      });

      test('추가배송비는 5000원', () => {
        const cost = calculateAddShippingCost({
          address,
          shippingGroupData,
          itemOption,
        });
        expect(cost).toBe(5000);
      });
    });

    describe('지역제한배송, 기본배송비 : 고정 - 서울 3000, 고정 - 경기 3000, 추가배송비 : 없음 적용시', () => {
      const shippingGroupData = deliveryLimitShippingGroupData;
      test('기본배송비는 null(배송지역이 아니므로)', () => {
        const cost = calculateStdShippingCost({
          address,
          shippingGroupData,
          itemOption,
        });
        expect(cost).toBe(null);
      });
    });
  });
});
