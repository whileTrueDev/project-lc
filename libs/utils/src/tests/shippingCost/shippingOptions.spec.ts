import {
  ShippingSetType,
  ShippingOptType,
  YesOrNo_UPPERCASE,
  Prisma,
} from '@prisma/client';
import { ShippingOptionWithCost } from '@project-lc/shared-types';
import {
  findApplicableOptionSection,
  addShippingCost,
  addRepeatShippingOptionCost,
  calculateShippingCostByOptType,
} from '../../lib/calculateShippingCost';

export function createShippingOption({
  id = 1,
  setId = 1,
  setType = 'std',
  optType = 'fixed',
  isDefault = 'N',
  section_st = null,
  section_ed = null,
  shippingCost = 2500,
  shippingArea = '대한민국',
}: {
  id?: number;
  setId?: number;
  setType?: ShippingSetType;
  optType?: ShippingOptType;
  isDefault?: YesOrNo_UPPERCASE | null;
  section_st?: number | null;
  section_ed?: number | null;
  shippingCost?: number;
  shippingArea?: string;
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
        shipping_area_name: shippingArea,
      },
    ],
  };
}

describe('배송비 옵션 관련 테스트', () => {
  describe('적용가능한 배송비 옵션 찾기 findApplicableOptionSection', () => {
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

  describe('구간반복 배송옵션의 배송비 적용 addRepeatShippingOptionCost', () => {
    describe('수량(구간반복) 배송옵션 : 주문금액 30000원 미만까지는 배송비 4000원 부과, 30000만원 이상부터는 주문금액 10000원당 1000원씩 부과', () => {
      const shippingOptions = [
        createShippingOption({
          optType: 'amount_rep',
          section_st: 0,
          section_ed: 30000,
          shippingCost: 4000,
        }),
        createShippingOption({
          optType: 'amount_rep',
          section_st: 30000,
          section_ed: 10000,
          shippingCost: 1000,
        }),
      ];
      test('총 주문금액이 20000원인 경우 배송비는 4000원이 부과된다', () => {
        // 총주문상품옵션 가격amount과 개수cnt
        const itemOption = {
          amount: 20000,
        };
        const shippingCost = addRepeatShippingOptionCost({
          baseCost: 0,
          optType: 'amount_rep',
          shippingOptions,
          itemOption,
        });
        expect(shippingCost).toBe(4000);
      });
      test('총 주문금액이 50000원인 경우 배송비는 6000원(4000 + 1000 + 1000)이 부과된다', () => {
        // 총주문상품옵션 가격amount과 개수cnt
        const itemOption = {
          amount: 50000,
        };
        const shippingCost = addRepeatShippingOptionCost({
          baseCost: 0,
          optType: 'amount_rep',
          shippingOptions,
          itemOption,
        });
        expect(shippingCost).toBe(6000);
      });
    });
    describe('개수(구간반복)인 배송옵션 : 주문상품개수 8개 미만까지는 배송비 5000원 부과, 8개 이상부터는 주문개수8개당 5000원씩 부과', () => {
      const shippingOptions = [
        createShippingOption({
          optType: 'cnt_rep',
          section_st: 0,
          section_ed: 8,
          shippingCost: 5000,
        }),
        createShippingOption({
          optType: 'cnt_rep',
          section_st: 8,
          section_ed: 8,
          shippingCost: 5000,
        }),
      ];
      test('총 주문개수가 7개인 경우 배송비는 5000원이 부과된다', () => {
        // 총주문상품옵션 가격amount과 개수cnt
        const itemOption = {
          cnt: 7,
        };
        const shippingCost = addRepeatShippingOptionCost({
          baseCost: 0,
          optType: 'cnt_rep',
          shippingOptions,
          itemOption,
        });
        expect(shippingCost).toBe(5000);
      });
      test('총 주문개수가 15개인 경우 배송비는 10000원이 부과된다', () => {
        // 총주문상품옵션 가격amount과 개수cnt
        const itemOption = {
          cnt: 15,
        };
        const shippingCost = addRepeatShippingOptionCost({
          baseCost: 0,
          optType: 'cnt_rep',
          shippingOptions,
          itemOption,
        });
        expect(shippingCost).toBe(10000);
      });
    });
  });

  describe('배송비 옵션타입에 따라 부과될 배송비 계산 calculateShippingCostByOptType', () => {
    describe('배송비 옵션타입이 무료 free 인 경우', () => {
      const shippingOptions = [
        createShippingOption({
          optType: 'free',
          section_st: null,
          section_ed: null,
          shippingCost: 0,
        }),
      ];
      test('배송비는 0', () => {
        const itemOption = { amount: 1000000, cnt: 10 };
        const shippingCost = calculateShippingCostByOptType({
          optType: 'free',
          shippingOptions,
          itemOption,
        });
        expect(shippingCost).toBe(0);
      });
    });

    describe('배송비 옵션타입이 고정 fixed 이고 배송비가 5000원 경우', () => {
      const shippingOptions = [
        createShippingOption({
          optType: 'fixed',
          section_st: null,
          section_ed: null,
          shippingCost: 5000,
        }),
      ];
      test('배송비는 5000', () => {
        const itemOption = { amount: 1000000, cnt: 10 };
        const shippingCost = calculateShippingCostByOptType({
          optType: 'fixed',
          shippingOptions,
          itemOption,
        });
        expect(shippingCost).toBe(5000);
      });
    });
  });
});
