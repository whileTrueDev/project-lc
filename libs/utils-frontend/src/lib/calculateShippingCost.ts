import {
  ShippingOption,
  ShippingCost,
  CartItemOption,
  ShippingSet,
  ShippingGroup,
  ShippingSetType,
  ShippingOptType,
} from '@prisma/client';
import { GoodsByIdRes } from '@project-lc/shared-types';
import { getStandardShippingCost } from './getStandardShippingCost';

/**
 * 가지고 있는 정보
 * ShippingGroup - 반송지정보, 배송비 계산방식, 기본/추가배송비 부과 여부, shippingSet[] 등
 * ShippingSet - 배송방식(택배, 직접배송 등), 전국배송/일부지역배송, 배송비 선불여부, shippingOption[]
 * ShippingOption - 기본/추가배송비 여부,
 * ShippingCost - 배송비, 적용지역
 */

export type ShippingOptionWithCost = ShippingOption & {
  shippingCost: ShippingCost[];
};
export type ShippingSetWithOptions = ShippingSet & {
  shippingOptions: Array<ShippingOptionWithCost>;
};

export type ShippingGroupData =
  | (ShippingGroup & {
      shippingSets: Array<ShippingSetWithOptions>;
    })
  | null;

/** 배송옵션의 배송비를 합쳐서 리턴함 */
export function addShippingCost(
  baseCost: number,
  applicableOption?: ShippingOptionWithCost,
): number {
  if (applicableOption) {
    return baseCost + Number(applicableOption.shippingCost[0].shipping_cost);
  }
  return baseCost;
}

/**
 * 적용가능한 배송비 옵션 찾기
 * 주어진 value가 배송비옵션의 section_st(구간시작값) 이상이고 section_ed(구간마지막값) 미만에 부합하는 첫번째 배송비옵션 리턴
 * 없으면 undefined 반환
 * @param options 배송비옵션 목록
 * @param value 상품의 무게 || 금액 || 수량(배송비옵션의 section_st, section_ed와 비교할 값)
 * @returns 적용범위에 맞는 배송비옵션, 없으면 undefined 반환
 */
export function findApplicableOptionSection(
  options: ShippingOptionWithCost[],
  value: number,
): undefined | ShippingOptionWithCost {
  // 오름차순 정렬
  const optionSorted = options.sort((a, b) => a.section_st - b.section_st);

  let foundApplicableOption: ShippingOptionWithCost | undefined;
  for (let i = 0; i < optionSorted.length; i++) {
    const { section_st, section_ed } = optionSorted[i];
    if (
      (section_st <= value && section_ed > value) ||
      (section_st <= value && section_ed === 0)
    ) {
      foundApplicableOption = optionSorted[i];
      break;
    }
  }
  return foundApplicableOption;
}

/** 구간반복 배송옵션의 배송비 적용
 * 구간반복의 경우 2개가 쌍으로 존재
 */
export function addRepeatShippingOptionCost({
  baseCost,
  optType,
  shippingOptions,
  itemOption,
}: {
  baseCost: number;
  shippingOptions: ShippingOptionWithCost[];
  optType: ShippingOptType;
  itemOption: { amount?: number; cnt?: number; weight?: number };
}): number {
  // 구간시작값 오름차순으로 정렬
  const optionSorted = shippingOptions.sort((a, b) => a.section_st - b.section_st);

  const firstOption = optionSorted[0]; // firstOption.section_st ~ section_ed 까지는 firstOption.cost 적용
  const secondOption = optionSorted[1]; // secondOption.section_st 부터 section_ed 개/원 당 secondOption.cost 적용

  if (!firstOption || !secondOption) return baseCost;

  // 고정된 부과 기준
  const fixedApplyLimit = firstOption.section_ed;
  // 반복 부과 기준
  const repeatCriteria = secondOption.section_ed;

  // 고정비용
  const fixedCost = Number(firstOption.shippingCost[0].shipping_cost);
  // 가격, 개수에 따라 반복 부과되는 비용
  const repeatCost = Number(secondOption.shippingCost[0].shipping_cost);

  const key = optType === 'amount_rep' ? 'amount' : 'cnt';

  if (!itemOption[key]) {
    return baseCost;
  }
  if (itemOption[key] <= fixedApplyLimit) {
    return baseCost + fixedCost;
  }

  const rest = itemOption[key] - fixedApplyLimit; // 고정비용 적용하고 남은 값
  const totalRepeatCost = Math.ceil(rest / repeatCriteria) * repeatCost; // 남은 값은 repeatCriteria 당 repeatCost 적용
  return baseCost + fixedCost + totalRepeatCost;
}

/**
 * 배송비 옵션타입에 따라 부과될 배송비 계산
 * @param itemOption 주문상품옵션 {가격, 개수, 무게}
 * @returns 배송비
 */
export function calculateShippingCostByOptType({
  optType,
  shippingOptions,
  itemOption,
}: {
  optType: ShippingOptType;
  shippingOptions: ShippingOptionWithCost[];
  itemOption: { amount?: number; cnt?: number; weight?: number };
}): number {
  let result = 0;
  // * 배송비 옵션 타입에 따라 추가배송비 계산
  // 배송비 옵션 타입 : 무료, 고정인경우 1개의 추가배송옵션만 존재
  if (['free', 'fixed'].includes(optType)) {
    result = addShippingCost(result, shippingOptions[0]);
  }
  // 배송비 옵션 타입 : 수량, 개수인경우
  if (['amount', 'cnt'].includes(optType)) {
    // 주문상품 개수, 가격에 적용가능한 구간값 가진 배송옵션 찾기
    const applicableOption = findApplicableOptionSection(
      shippingOptions,
      itemOption[optType],
    );
    result = addShippingCost(result, applicableOption);
  }
  // 배송비 옵션 타입 :수량(구간반복), 개수(구간반복)인 경우
  if (['amount_rep', 'cnt_rep'].includes(optType)) {
    result = addRepeatShippingOptionCost({
      baseCost: result,
      optType,
      shippingOptions,
      itemOption,
    });
  }

  return result;
}

/** 장바구니 페이지에서 사용하는 추가배송비 구하기
 */
export const getAdditionalShippingCostUnlimitDelivery = (
  itemOption: { amount?: number; cnt?: number; weight?: number }, // 상품옵션 금액, 수량, 무게
  shippingGroup: ShippingGroupData,
): number => {
  // * 배송비그룹의 배송설정 중 default_yn === Y 인 배송설정 찾기(기본배송설정) || 기본배송설정 없으면 첫번째 배송설정 사용
  const shippingSet =
    shippingGroup.shippingSets.find((set) => set.default_yn === 'Y') ||
    shippingGroup.shippingSets[0];

  if (!shippingSet) return null;

  // * 배송세트가 제한지역배송인 경우 장바구니에서 표시될 배송비에서는 고려하지 않는다
  // 지역제한배송인경우 주소가 기본배송옵션들 중 options.shippingCost.shipping_area_name에 없으면 배송불가지역
  if (shippingSet.delivery_limit === 'limit') {
    // 전국배송 'unlimit' | 지역배송 'limit'
    return 0;
  }

  // * 해당 배송설정의 배송방법 중 추가배송비옵션 찾기(shipping_set_type이 add 인 배송옵션)
  const foundShippingOptions = shippingSet.shippingOptions.filter(
    (opt) => opt.shipping_set_type === 'add',
  );
  if (!foundShippingOptions.length) return null;

  // 배송비 옵션 타입 찾기 (동일 배송설정에 연결된 기본배송옵션/추가배송옵션들은 같은 shipping_opt_type 가짐)
  const optType = foundShippingOptions[0].shipping_opt_type;

  // * 배송비 옵션 타입에 따라 추가배송비 계산
  const shippingCostByOptType = calculateShippingCostByOptType({
    optType,
    shippingOptions: foundShippingOptions,
    itemOption,
  });

  return shippingCostByOptType;
  // // 배송비 옵션 타입 : 무료, 고정인경우 1개의 추가배송옵션만 존재
  // if (['free', 'fixed'].includes(optType)) {
  //   result = addShippingCost(result, foundShippingOptions[0]);
  // }
  // // 배송비 옵션 타입 : 수량, 개수인경우
  // if (['amount', 'cnt'].includes(optType)) {
  //   // 주문상품 개수, 가격에 적용가능한 구간값 가진 배송옵션 찾기
  //   const applicableOption = findApplicableOptionSection(
  //     foundShippingOptions,
  //     itemOption[optType],
  //   );
  //   result = addShippingCost(result, applicableOption);
  // }
  // // 배송비 옵션 타입 :수량(구간반복), 개수(구간반복)인 경우
  // if (['amount_rep', 'cnt_rep'].includes(optType)) {
  //   result = addRepeatShippingOptionCost({
  //     baseCost: result,
  //     optType,
  //     shippingOptions: foundShippingOptions,
  //     itemOption,
  //   });
  // }

  // return result;
};

/** 장바구니 페이지에서 해당 배송비 정책에 부과될 배송비 계산
 * => 기본 배송세트(ShippingSet.default_yn === Y)의 배송옵션을 기준으로 계산 (주소, 배송방식 고려하지 않음)
 * */
export const calculateShippingCostInCartTable = ({
  shippingGroup,
  options,
  withShippingCalculTypeFree,
}: {
  shippingGroup: GoodsByIdRes['ShippingGroup'];
  options: CartItemOption[];
  withShippingCalculTypeFree?: boolean; // 동일 판매자의 shipping_calcul_type === 'free'인 다른 배송그룹상품과 같이 주문했는지 여부
}): number | null => {
  if (!options.length) return null;

  const {
    shipping_calcul_type,
    shipping_calcul_free_yn,
    shipping_std_free_yn,
    shipping_add_free_yn,
  } = shippingGroup;

  // withShippingCalculTypeFree 값과
  // shipping_calcul_free_yn, shipping_std_free_yn, shipping_add_free_yn 값에 따라
  // 기본배송비와 추가배송비 부과여부 달라짐
  const isStdShippingCostFree =
    (withShippingCalculTypeFree && shipping_std_free_yn) ||
    (withShippingCalculTypeFree && shipping_calcul_free_yn);

  const isAddShippingCostFree =
    (withShippingCalculTypeFree && shipping_add_free_yn) ||
    (withShippingCalculTypeFree && shipping_calcul_free_yn);

  // 전체 상품옵션개수, 상품옵션가격, 상품옵션무게 총합
  const optionsTotal = {
    // 가격 총합
    amount: options
      .map((opt) => opt.discountPrice)
      .reduce((sum, cur) => sum + Number(cur), 0),
    // 개수 총 합
    cnt: options.map((opt) => opt.quantity).reduce((sum, cur) => sum + cur, 0),
    // 무게 총 합
    weight: options.map((opt) => opt.weight).reduce((sum, cur) => sum + cur, 0),
  };

  let shippingCostResult = 0;

  // 배송비그룹 묶음계산-무료배송인경우 기본배송비 1번만 부과, 추가배송비 1번만 부과
  if (shipping_calcul_type === 'bundle') {
    if (!isStdShippingCostFree) {
      shippingCostResult += Number(getStandardShippingCost(shippingGroup));
    }
    if (!isAddShippingCostFree) {
      shippingCostResult += getAdditionalShippingCostUnlimitDelivery(
        optionsTotal, // 상품옵션 총 금액, 총 수량, 총 무게
        shippingGroup,
      );
    }
  }
  // 배송비그룹 개별계산-개별배송인경우 상품 개수만큼 기본배송비와 추가배송비 부과
  if (shipping_calcul_type === 'each') {
    if (!isStdShippingCostFree) {
      shippingCostResult +=
        optionsTotal.cnt * Number(getStandardShippingCost(shippingGroup));
    }
    if (!isAddShippingCostFree) {
      options.forEach((opt) => {
        shippingCostResult +=
          opt.quantity *
          getAdditionalShippingCostUnlimitDelivery(
            { amount: Number(opt.discountPrice), cnt: 1, weight: opt.weight },
            shippingGroup,
          );
      });
    }
  }
  // 배송비그룹 무료계산-묶음배송인 경우 기본배송비는 무료, 추가배송비 1번만 부과
  if (shipping_calcul_type === 'free') {
    if (!isAddShippingCostFree) {
      shippingCostResult += getAdditionalShippingCostUnlimitDelivery(
        optionsTotal, // 상품옵션 총 금액, 총 수량, 총 무게
        shippingGroup,
      );
    }
  }
  return shippingCostResult;
};
