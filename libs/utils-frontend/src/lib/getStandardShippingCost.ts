import { CartItemOption } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { GoodsByIdRes } from '@project-lc/shared-types';

export const getStandardShippingCost = (
  shippingGroup?: GoodsByIdRes['ShippingGroup'],
): Decimal => {
  const shippingSet = shippingGroup?.shippingSets.find(
    (set) => set.delivery_nation === 'korea',
  );
  if (!shippingSet) return null;
  const opts = shippingSet.shippingOptions.filter(
    (opt) => opt.shipping_set_type === 'std',
  );
  const defaultOpt = opts.find((o) => o.shipping_set_type === 'std');
  if (!defaultOpt) return null;
  const cost = defaultOpt?.shippingCost.find((c) => c.shipping_cost)?.shipping_cost;

  return cost;
};

// 추가배송비 구하기
export const getAdditionalShippingCost = (
  itemOption: { amount?: number; cnt?: number; weight?: number }, // 상품옵션 총 금액, 총 수량, 총 무게
  shippingGroup?: GoodsByIdRes['ShippingGroup'],
): number => {
  // 배송비그룹의 배송설정 중 "대한민국,택배"인 배송설정 찾기(이 배송설정밖에 안씀)
  const shippingSet = shippingGroup.shippingSets.find(
    (set) => set.delivery_nation === 'korea' && set.shipping_set_code === 'delivery',
  );
  if (!shippingSet) return null;

  // 해당 배송설정의 배송방법 중 shipping_set_type이 add 인 "추가배송옵션" 찾기
  const addShippingOptions = shippingSet.shippingOptions.filter(
    (opt) => opt.shipping_set_type === 'add',
  );
  if (!addShippingOptions.length) return null;

  // 배송비 부과 타입 찾기 (동일 배송설정에 연결된 추가배송옵션들은 모두 같은 shipping_opt_type 가짐)
  // 무료, 고정인경우 1개의 추가배송옵션만 존재
  // 나머지(금액, 수량, 무게)는 2개이상의 추가배송옵션이 쌍으로 존재
  const addShippingOptionType = addShippingOptions[0].shipping_opt_type;

  let result = 0;
  // ShippingOptType에 따라 추가배송비 구하기
  switch (addShippingOptionType) {
    case 'free': // 무료
      break;
    case 'fixed': // 고정
      result += Number(addShippingOptions[0].shippingCost[0].shipping_cost);
      break;
    case 'amount': // 금액(구간입력)
      break;
    case 'amount_rep': // 금액(구간반복)
      break;
    case 'cnt': // 수량(구간입력)
      break;
    case 'cnt_rep': // 수량(구간반복)
      break;
    // 기능단순화 위해 현재 사용하지 않는 무게 옵션 주석처리함
    // case 'weight': // -> 무게(구간입력)
    //   break;
    // case 'weight_rep': // 무게(구간반복)
    //   break;
    default:
      break;
  }

  return result;
};

/** 해당 배송비 정책에 부과될 배송비 계산
 */
export const calculateShippingCostInCartTable = ({
  shippingGroup,
  options,
}: {
  shippingGroup: GoodsByIdRes['ShippingGroup'];
  options: CartItemOption[];
}): number | null => {
  if (!options.length) return null;

  const { shipping_calcul_type } = shippingGroup;

  let shippingCostResult = 0;
  // 배송비그룹 묶음계산-무료배송인경우 기본배송비 1번만 부과, 추가배송비 1번만 부과
  if (shipping_calcul_type === 'bundle') {
    shippingCostResult += Number(getStandardShippingCost(shippingGroup));
  }
  // 배송비그룹 개별계산-개별배송인경우 상품 개수만큼 기본배송비와 추가배송비 부과
  if (shipping_calcul_type === 'each') {
    shippingCostResult += 0;
  }
  // 배송비그룹 무료계산-묶음배송인 경우 기본배송비는 무료, 추가배송비 1번만 부과
  if (shipping_calcul_type === 'free') {
    shippingCostResult += 0;
  }
  return shippingCostResult;
};
