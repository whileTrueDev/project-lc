import { LimitOrUnlimit } from '@prisma/client';
import {
  checkRemoteArea,
  checkShippingAvailable,
  filterDeliveryLimitedShippingOptions,
  getShippingAreas,
} from '../../lib/calculateShippingCost';
import { createShippingOption } from './shippingOptions.spec';
import {
  dummyShippingGroup,
  dummyShippingSet,
} from './calculateShippingCostInCartTable.spec';

describe('제주 및 도서산간 지역인지 확인', () => {
  test(' 우편번호 54000 true', () => {
    const postalCode = '54000';
    const isRemote = checkRemoteArea({ address: '', postalCode });
    expect(isRemote).toBe(true);
  });

  test(' 우편번호 23005 true', () => {
    const postalCode = '23005';
    const isRemote = checkRemoteArea({ address: '', postalCode });
    expect(isRemote).toBe(true);
  });
});

describe('배송가능여부 판단', () => {
  describe('배송지역제한, 전라북도 충청북도만 배송옵션에 설정된 경우', () => {
    const shippingGroupData = {
      ...dummyShippingGroup,
      shippingSets: [
        {
          ...dummyShippingSet,
          delivery_limit: LimitOrUnlimit.limit, // 지역제한배송
          shippingOptions: [
            createShippingOption({
              setType: 'std',
              optType: 'cnt_rep',
              section_st: 0,
              section_ed: 10,
              shippingCost: 0,
              shippingArea: '전라북도',
            }),
            createShippingOption({
              setType: 'std',
              optType: 'cnt_rep',
              section_st: 10,
              section_ed: 1,
              shippingCost: 1000,
              shippingArea: '전라북도',
            }),
            createShippingOption({
              setType: 'std',
              optType: 'cnt_rep',
              section_st: 0,
              section_ed: 10,
              shippingCost: 0,
              shippingArea: '충청북도',
            }),
            createShippingOption({
              setType: 'std',
              optType: 'cnt_rep',
              section_st: 10,
              section_ed: 1,
              shippingCost: 1000,
              shippingArea: '충청북도',
            }),
          ],
        },
      ],
    };

    test('받는곳 주소가 전남인 경우 배송불가지역', () => {
      const address = '전남 순천시 가곡길 2 (민서유통)';
      const postalCode = '57923';
      const result = checkShippingAvailable({ address, postalCode, shippingGroupData });
      expect(result).toBe(false);
    });

    test('받는곳 주소가 충북인 경우 배송가능지역', () => {
      const address = '충북 단양군 가곡면 가대궁골1길 지하 1';
      const postalCode = '27021';
      const result = checkShippingAvailable({ address, postalCode, shippingGroupData });
      expect(result).toBe(true);
    });

    test('받는곳 주소가 충북인경우 배송지역 충북인 배송옵션만 추려내기', () => {
      const { shippingOptions } = shippingGroupData.shippingSets[0];
      const address = '충북 단양군 가곡면 가대궁골1길 지하 1';
      const postalCode = '27021';
      const filtered = filterDeliveryLimitedShippingOptions({
        address,
        postalCode,
        shippingOptions,
      });

      const filteredOptionsShippingAreaList = getShippingAreas(filtered);
      expect(filteredOptionsShippingAreaList.every((area) => area === '충청북도')).toBe(
        true,
      );
    });
  });
});
