import {
  CartItem,
  CartItemOption,
  Prisma,
  ShippingGroup,
  ShippingSet,
} from '@prisma/client';
import { ShippingGroupData } from '@project-lc/shared-types';
import {
  calculateShippingCostInCartTable,
  calculateStdShippingCost,
} from '../../lib/calculateShippingCost';
import { createShippingOption } from './shippingOptions.spec';

export const dummyShippingGroup: ShippingGroup = {
  id: 1,
  sellerId: 1,
  baseAddress: '',
  detailAddress: '',
  postalCode: '',
  shipping_group_name: '더미배송비그룹1',
  shipping_calcul_type: 'bundle',
  shipping_calcul_free_yn: 'N',
  shipping_std_free_yn: 'N',
  shipping_add_free_yn: 'N',
};
export const dummyShippingSet: ShippingSet = {
  id: 1,
  shipping_group_seq: 1,
  shipping_set_code: 'delivery',
  shipping_set_name: '더미배송세트이름',
  default_yn: 'N',
  delivery_nation: 'korea',
  delivery_limit: 'unlimit',
  refund_shiping_cost: null,
  swap_shiping_cost: null,
  prepay_info: 'delivery',
  shiping_free_yn: 'N',
};

describe('장바구니 배송비계산', () => {
  describe('장바구니 페이지에서 배송비 정책에 부과될 배송비 계산 calculateShippingCostInCartTable', () => {
    /**
     * 장바구니에 에 담긴 상품은 두가지(육포, 타트체리)
     * 육포(cartItemId : 1) 보통맛 10개
     * 육포(cartItemId : 1) 매운밧 15개
     * 타트체리(cartItemId : 2) 라지 2개
     * 육포과 타트체리는 동일판매자, 동일한 배송비그룹이라고 가정함
     */
    const cartItems: Array<CartItem & { options: CartItemOption[] }> = [
      {
        id: 1,
        createDate: new Date(),
        customerId: 1,
        tempUserId: null,
        goodsId: 1,
        shippingGroupId: 1,
        channel: 'normal',
        options: [
          {
            id: 1,
            cartItemId: 1,
            name: '육포 맛',
            value: '보통맛',
            quantity: 10,
            normalPrice: new Prisma.Decimal(5000),
            discountPrice: new Prisma.Decimal(4000),
            weight: null,
            goodsOptionsId: 1,
          },
          {
            id: 2,
            cartItemId: 1,
            name: '육포 맛',
            value: '매운맛',
            quantity: 15,
            normalPrice: new Prisma.Decimal(6000),
            discountPrice: new Prisma.Decimal(5000),
            weight: null,
            goodsOptionsId: 2,
          },
        ],
      },
      {
        id: 2,
        createDate: new Date(),
        customerId: 1,
        tempUserId: null,
        goodsId: 2,
        shippingGroupId: 1,
        channel: 'normal',
        options: [
          {
            id: 3,
            cartItemId: 2,
            name: '타트체리 사이즈',
            value: '라지',
            quantity: 2,
            normalPrice: new Prisma.Decimal(26000),
            discountPrice: new Prisma.Decimal(24000),
            weight: null,
            goodsOptionsId: 3,
          },
        ],
      },
    ];

    // 기본배송비 고정 2000원
    // 추가배송비 0~10개 미만은 0원부과, 10개이상은 3000원 부과
    const shippingOptions = [
      createShippingOption({
        setType: 'std',
        optType: 'fixed',
        shippingCost: 2000,
      }),
      createShippingOption({
        setType: 'add',
        optType: 'cnt',
        section_st: 0,
        section_ed: 10,
        shippingCost: 0,
      }),
      createShippingOption({
        setType: 'add',
        optType: 'cnt',
        section_st: 10,
        section_ed: 0,
        shippingCost: 3000,
      }),
    ];
    describe('배송비그룹 배송비 계산방식이 묶음계산-무료배송(bundle)인 경우', () => {
      const shippingGroupData: ShippingGroupData = {
        ...dummyShippingGroup,
        shipping_calcul_type: 'bundle',
        shippingSets: [
          {
            ...dummyShippingSet,
            shippingOptions,
          },
        ],
      };

      test('기본배송비 2000 + 추가배송비 0 (장바구니에서는 추가배송비 고려 x) => 총 배송비 2000원', () => {
        const shippingCost = calculateShippingCostInCartTable({
          shippingGroup: shippingGroupData,
          cartItems,
          withShippingCalculTypeFree: false,
        });
        expect(shippingCost.std).toBe(2000);
        expect(shippingCost.add).toBe(0);
        expect(shippingCost.add + shippingCost.std).toBe(2000);
      });
    });

    describe('배송비그룹 배송비 계산방식이 개별계산-개별배송(each)인 경우', () => {
      const shippingGroupData: ShippingGroupData = {
        ...dummyShippingGroup,
        shipping_calcul_type: 'each',
        shippingSets: [{ ...dummyShippingSet, shippingOptions }],
      };

      test('상품별 기본배송비 (2000 * 2) + 상품별 추가배송비 0 (장바구니에서는 추가배송비 고려 x) => 총 배송비 4000원', () => {
        const shippingCost = calculateShippingCostInCartTable({
          shippingGroup: shippingGroupData,
          cartItems,
          withShippingCalculTypeFree: false,
        });
        expect(shippingCost.std).toBe(4000);
        expect(shippingCost.add).toBe(0);
        expect(shippingCost.add + shippingCost.std).toBe(4000);
      });
    });

    describe('배송비그룹 배송비 계산방식이 무료계산-묶음배송(free)인 경우', () => {
      const shippingGroupData: ShippingGroupData = {
        ...dummyShippingGroup,
        shipping_calcul_type: 'free',
        shippingSets: [{ ...dummyShippingSet, shippingOptions }],
      };

      test('기본배송비 0 + 추가배송비 0 (장바구니에서는 추가배송비 고려 x) => 총 배송비 0', () => {
        const shippingCost = calculateShippingCostInCartTable({
          shippingGroup: shippingGroupData,
          cartItems,
          withShippingCalculTypeFree: false,
        });
        expect(shippingCost.std).toBe(0);
        expect(shippingCost.add).toBe(0);
        expect(shippingCost.add + shippingCost.std).toBe(0);
      });
    });
  });

  describe('기본배송비 30000원 미만 배송비 5000원, 30000이상 무료배송', () => {
    const shippingOptions = [
      createShippingOption({
        setType: 'std',
        optType: 'amount',
        section_st: 0,
        section_ed: 30000,
        shippingCost: 5000,
      }),
      createShippingOption({
        setType: 'std',
        optType: 'amount',
        section_st: 30000,
        section_ed: 0,
        shippingCost: 0,
      }),
    ];
    const shippingGroupData: ShippingGroupData = {
      ...dummyShippingGroup,
      shipping_calcul_type: 'bundle',
      shippingSets: [
        {
          ...dummyShippingSet,
          shippingOptions,
        },
      ],
    };
    test('25000원 주문시 기본배송비 5000원', () => {
      const stdCost = calculateStdShippingCost({
        shippingGroupData,
        itemOption: { amount: 25000 },
      });
      expect(stdCost).toBe(5000);
    });

    test('45000원 주문시 기본배송비 0원', () => {
      const stdCost = calculateStdShippingCost({
        shippingGroupData,
        itemOption: { amount: 45000 },
      });
      expect(stdCost).toBe(0);
    });
  });

  describe(`기본배송비 배송지역 서울, 경기도로 제한, 
  서울지역 30000원 미만 배송비 2000원, 30000이상 무료배송
  경기도지역 30000원 미만 배송비 5000원, 30000원이상 무료배송
  `, () => {
    const shippingOptions = [
      createShippingOption({
        setType: 'std',
        optType: 'amount',
        section_st: 0,
        section_ed: 30000,
        shippingCost: 2000,
        shippingArea: '서울특별시',
      }),
      createShippingOption({
        setType: 'std',
        optType: 'amount',
        section_st: 30000,
        section_ed: 0,
        shippingCost: 0,
        shippingArea: '서울특별시',
      }),
      createShippingOption({
        setType: 'std',
        optType: 'amount',
        section_st: 0,
        section_ed: 30000,
        shippingCost: 5000,
        shippingArea: '경기도',
      }),
      createShippingOption({
        setType: 'std',
        optType: 'amount',
        section_st: 30000,
        section_ed: 0,
        shippingCost: 0,
        shippingArea: '경기도',
      }),
    ];
    const shippingGroupData: ShippingGroupData = {
      ...dummyShippingGroup,
      shipping_calcul_type: 'bundle',
      shippingSets: [
        {
          ...dummyShippingSet,
          shippingOptions,
        },
      ],
    };
    test('25000원 주문시 기본배송비 2000원 (주소정보가 없는경우 첫번째 지역의 배송비 선택)', () => {
      const stdCost = calculateStdShippingCost({
        shippingGroupData,
        itemOption: { amount: 25000 },
      });
      expect(stdCost).toBe(2000);
    });

    test('45000원 주문시 기본배송비 0원(주소정보가 없는경우 첫번째 지역의 배송비 선택)', () => {
      const stdCost = calculateStdShippingCost({
        shippingGroupData,
        itemOption: { amount: 45000 },
      });
      expect(stdCost).toBe(0);
    });
  });
});
