import {
  Prisma,
  ShippingCost,
  ShippingGroup,
  ShippingOption,
  ShippingOptType,
  ShippingSet,
  ShippingSetType,
  YesOrNo_UPPERCASE,
} from '@prisma/client';

import {
  addShippingCost,
  findApplicableOptionSection,
  ShippingGroupData,
  ShippingOptionWithCost,
} from '../lib/calculateShippingCost';

function createShippingOption({
  id = 1,
  setId = 1,
  setType = 'std',
  optType = 'fixed',
  isDefault = 'N',
  section_st = null,
  section_ed = null,
  shippingCost = 2500,
}: {
  id?: number;
  setId?: number;
  setType?: ShippingSetType;
  optType?: ShippingOptType;
  isDefault?: YesOrNo_UPPERCASE | null;
  section_st?: number | null;
  section_ed?: number | null;
  shippingCost?: number;
}): ShippingOptionWithCost {
  return {
    id,
    shipping_set_seq: setId,
    shipping_set_type: setType,
    shipping_opt_type: optType,
    default_yn: isDefault,
    section_st,
    section_ed,
    shippingCost: [
      {
        id: 1,
        shipping_opt_seq: id,
        shipping_cost: new Prisma.Decimal(shippingCost),
        shipping_area_name: '대한민국',
      },
    ],
  };
}
const dummyShippingGroup: ShippingGroup = {
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
const dummyShippingSet: ShippingSet = {
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
// 기본배송비옵션들
// 기본배송비옵션 - 고정 - 대한민국 2500원
const stdFixedShippingOption: ShippingOptionWithCost = createShippingOption({});

// 추가배송비 옵션들
// 추가배송비옵션 - 고정 - 대한민국 2500원
const dummyShippingAddOptionFixed: ShippingOptionWithCost = createShippingOption({
  setType: 'add',
});
const dummyShippingGroupWithOnlyStdOption: ShippingGroupData = {
  ...dummyShippingGroup,
  shippingSets: [
    {
      ...dummyShippingSet,
      shippingOptions: [stdFixedShippingOption],
    },
  ],
};

const dummyShippingGroupWithAddOptions: ShippingGroupData = {
  ...dummyShippingGroup,
  shippingSets: [
    {
      ...dummyShippingSet,
      shippingOptions: [stdFixedShippingOption, dummyShippingAddOptionFixed],
    },
  ],
};

describe('배송비계산', () => {
  describe('findApplicableOptionSection', () => {
    describe('배송옵션타입이 amount(가격)인 경우 주문가격에 따라 적용가능한 배송옵션 찾기', () => {
      // 주문가격 0 이상 30000 미만일때 배송비 4000원
      const option1 = createShippingOption({
        optType: 'amount',
        section_st: 0,
        section_ed: 30000,
        shippingCost: 4000,
      });
      // 주문가격 30000 이상 50000미만일때 배송비 3000
      const option2 = createShippingOption({
        optType: 'amount',
        section_st: 30000,
        section_ed: 50000,
        shippingCost: 3000,
      });
      const optList = [option1, option2];
      test('주문금액이 25000원인 경우 배송비 4000 부과', () => {
        const totalPrice = 25000;
        const applicableOption = findApplicableOptionSection(optList, totalPrice);
        let shippingCost = 0;
        shippingCost = addShippingCost(shippingCost, applicableOption);
        expect(shippingCost).toBe(4000);
      });

      test('주문금액이 31000원인 경우 배송비 3000 부과', () => {
        const totalPrice = 31000;
        const applicableOption = findApplicableOptionSection(optList, totalPrice);
        let shippingCost = 0;
        shippingCost = addShippingCost(shippingCost, applicableOption);
        expect(shippingCost).toBe(3000);
      });
      test('주문금액이 51000원인 경우 배송비 0 부과', () => {
        const totalPrice = 51000;
        const applicableOption = findApplicableOptionSection(optList, totalPrice);
        let shippingCost = 0;
        shippingCost = addShippingCost(shippingCost, applicableOption);
        expect(shippingCost).toBe(0);
      });
    });

    describe('배송옵션타입이 cnt(개수)인 경우 주문개수에 따라 적용가능한 배송옵션 찾기', () => {
      // 주문개수 0 이상 100개 미만일때 배송비 4000원
      const option1 = createShippingOption({
        optType: 'cnt',
        section_st: 0,
        section_ed: 100,
        shippingCost: 4000,
      });
      // 주문개수 100개 이상일때 배송비 3000
      const option2 = createShippingOption({
        optType: 'cnt',
        section_st: 100,
        section_ed: 0,
        shippingCost: 3000,
      });
      const optList = [option1, option2];
      test('주문개수 2개 경우 배송비 4000 부과', () => {
        const totalCount = 2;
        const applicableOption = findApplicableOptionSection(optList, totalCount);
        let shippingCost = 0;
        shippingCost = addShippingCost(shippingCost, applicableOption);
        expect(shippingCost).toBe(4000);
      });

      test('주문개수 150개인 경우 배송비 3000 부과', () => {
        const totalCount = 150;
        const applicableOption = findApplicableOptionSection(optList, totalCount);
        let shippingCost = 0;
        shippingCost = addShippingCost(shippingCost, applicableOption);
        expect(shippingCost).toBe(3000);
      });
    });
  });

  describe('addRepeatShippingOptionCost', () => {
    describe('수량(구간반복)인 경우', () => {});
    describe('개수(구간반복)인 경우', () => {});
  });
});
