import {
  CartItem,
  CartItemOption,
  GoodsOptions,
  ShippingGroup,
  ShippingOptType,
} from '@prisma/client';
import {
  GoodsByIdRes,
  koreaProvincesShortForm,
  remoteAreaPostalcode,
  ShippingCheckItem,
  ShippingCostCalculatedType,
  ShippingGroupData,
  ShippingOptionCost,
  ShippingOptionWithCost,
} from '@project-lc/shared-types';

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
      (section_st <= value && !section_ed) // section_ed가 0 이거나 Null인 경우
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
  if (optType === 'amount' || optType === 'cnt') {
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

/** 장바구니 상품옵션 목록 받아서
 * 총 주문개수
 * 총 주문가격
 * 총 무게 계산
 */
function sumItemOptionValues(options: CartItemOption[]): {
  cnt?: number;
  amount?: number;
  weight?: number;
} {
  return options.reduce((total, opt) => {
    const sumOfAmount = Number(opt.discountPrice) * opt.quantity;
    const sumOfWeight = opt.weight * opt.quantity;
    return {
      cnt: total.cnt ? total.cnt + opt.quantity : opt.quantity,
      amount: total.amount ? total.amount + sumOfAmount : sumOfAmount,
      weight: total.weight ? total.weight + sumOfWeight : sumOfWeight,
    };
  }, {} as { cnt?: number; amount?: number; weight?: number });
}

/** 기본배송비, 추가배송비 부과여부 확인
 * isStdShippingCostFree: true 인경우 기본배송비 무료처리(부과하지 않음)
 * isAddShippingCostFree: true 인경우 추가배송비 무료처리(부과하지 않음)
 */
const checkShippingCostFree = (
  shippingGroup: ShippingGroup,
  withShippingCalculTypeFree: boolean,
): {
  isStdShippingCostFree: boolean;
  isAddShippingCostFree: boolean;
} => {
  const { shipping_calcul_free_yn, shipping_std_free_yn, shipping_add_free_yn } =
    shippingGroup;

  // withShippingCalculTypeFree 값과
  // shipping_calcul_free_yn, shipping_std_free_yn, shipping_add_free_yn 값에 따라
  // 기본배송비와 추가배송비 부과여부 달라짐
  const isStdShippingCostFree =
    (withShippingCalculTypeFree && shipping_std_free_yn === 'Y') ||
    (withShippingCalculTypeFree && shipping_calcul_free_yn === 'Y');

  const isAddShippingCostFree =
    (withShippingCalculTypeFree && shipping_add_free_yn === 'Y') ||
    (withShippingCalculTypeFree && shipping_calcul_free_yn === 'Y');
  return {
    isStdShippingCostFree,
    isAddShippingCostFree,
  };
};

/** 배송옵션목록에서 배송옵션에 설정된 주소목록을 반환 (주소 형태는 KOREA_PROVINCES 에 있음)
 * @return  예 : ['전라북도', '충청북도']
 */
export function getShippingAreas(shippingOptions: ShippingOptionWithCost[]): string[] {
  const areas = shippingOptions
    .flatMap((opt) => opt.shippingCost)
    .map((cost) => cost.shipping_area_name);

  return [...new Set(areas)];
}

/** 입력된 address 가 shippingAreas에 포함되는지 확인 */
export function checkShippingAreaCoversAddress({
  shippingAreas,
  address,
  postalCode,
}: {
  postalCode: string;
  address: string;
  shippingAreas: string[]; // 배송옵션 설정된 주소string[]
}): boolean {
  let shippingFlag = false;
  // 지역명 축약형태가 address의 시작부분인지 확인
  shippingAreas.forEach((area) => {
    const provinceShortForm = koreaProvincesShortForm[area];
    if (address.startsWith(provinceShortForm)) {
      shippingFlag = true;
    }
  });
  return shippingFlag;
}

/** 입력된 address에 해당하는 지역에 적용될 shippingOptions만 필터링하기 */
export function filterDeliveryLimitedShippingOptions({
  address,
  shippingOptions,
}: {
  address: string;
  postalCode?: string;
  shippingOptions: ShippingOptionWithCost[];
}): ShippingOptionWithCost[] {
  const filtered = shippingOptions.filter((opt) => {
    return opt.shippingCost.some((cost) => {
      const shortFormShippingArea = koreaProvincesShortForm[cost.shipping_area_name];
      return address.startsWith(shortFormShippingArea);
    });
  });
  return filtered;
}

/**  배송가능여부 판단 - 배송정책이 지역제한배송이고 기본배송비옵션 중 주어진 주소가 없는경우 배송불가지역으로 판단함 */
export function checkShippingAvailable({
  shippingGroupData,
  address,
  postalCode,
}: {
  postalCode: string;
  address: string;
  shippingGroupData: ShippingGroupData;
}): boolean {
  const defaultShippingSet =
    shippingGroupData.shippingSets.find((set) => set.default_yn === 'Y') ||
    shippingGroupData.shippingSets[0];

  const stdOptions = defaultShippingSet.shippingOptions.filter(
    (opt) => opt.shipping_set_type === 'std',
  );

  const isNationwide = defaultShippingSet.delivery_limit === 'unlimit';
  if (isNationwide) {
    return true;
  }

  const shippingAreas = getShippingAreas(stdOptions);
  const shippingFlag = checkShippingAreaCoversAddress({
    address,
    postalCode,
    shippingAreas,
  });

  return shippingFlag;
}

/** 기본배송비 계산
 * @param address? optional 값. 배송지 주소
 *        address 가 있는 경우 주소지 고려하여 기본배송비 계산(지역제한배송인데 address 주소에 대한 배송옵션이 없는경우 배송불가지역으로 판단하여 null리턴)
 *        address 가 없는 경우 & 지역제한배송인 경우 배송옵션지역 중 임의로 첫번째 지역에 대한 배송옵션가격 적용
 */
export function calculateStdShippingCost({
  address,
  shippingGroupData,
  itemOption,
}: {
  address?: string;
  shippingGroupData: ShippingGroupData;
  itemOption: { amount?: number; cnt?: number; weight?: number };
}): number | null {
  // 1. shippingGroup(배송비그룹)의 default shippingSet(배송정책)찾기
  const defaultShippingSet =
    shippingGroupData.shippingSets.find((set) => set.default_yn === 'Y') ||
    shippingGroupData.shippingSets[0];

  // 3. shippingSet(배송정책)의 shippingOptions를 std options(기본배송비옵션)와 add options(추가배송비옵션) 로 구분
  const stdOptions = defaultShippingSet.shippingOptions.filter(
    (opt) => opt.shipping_set_type === 'std',
  );

  // 배송정책이 전국배송인지 지역제한배송인지 확인
  const isDeliveryAreaLimited = defaultShippingSet.delivery_limit === 'limit';

  // 전국배송인경우 전체 배송옵션 고려하여 기본배송비 계산
  let shippingOptions = stdOptions;

  // * 주소정보가 있는 경우
  if (address) {
    // 지역제한배송인경우 받는곳 주소에 해당하는 배송옵션만 추려내어 기본배송비를 계산한다
    if (isDeliveryAreaLimited) {
      shippingOptions = filterDeliveryLimitedShippingOptions({
        address,
        shippingOptions: stdOptions,
      });
    }

    if (shippingOptions.length === 0) return null;
  }

  // * 주소정보가 없는경우 => 기본배송옵션의 shippingCost.shipping_area_name이 대한민국이 아님. 특정 지역이 저장됨
  // 지역제한배송인 경우 배송옵션 지역 중 첫번째 지역의 배송옵션 가격으로 기본배송비 계산한다
  if (isDeliveryAreaLimited) {
    const areaList = getShippingAreas(shippingOptions);
    const baseArea = areaList[0];
    shippingOptions = stdOptions.filter((opt) => {
      return opt.shippingCost.some((cost) => cost.shipping_area_name === baseArea);
    });
  }

  const optType = shippingOptions[0].shipping_opt_type;

  const cost = calculateShippingCostByOptType({
    optType,
    shippingOptions,
    itemOption,
  });
  return cost;
}

/** 주소지 고려하여 추가배송비 계산
 */
export function calculateAddShippingCost({
  address,
  shippingGroupData,
  itemOption,
}: {
  address: string;
  shippingGroupData: ShippingGroupData;
  itemOption: { amount?: number; cnt?: number; weight?: number };
}): number {
  // 1. shippingGroup(배송비그룹)의 default shippingSet(배송정책)찾기
  const defaultShippingSet =
    shippingGroupData.shippingSets.find((set) => set.default_yn === 'Y') ||
    shippingGroupData.shippingSets[0];

  // 3. shippingSet(배송정책)의 shippingOptions를 std options(기본배송비옵션)와 add options(추가배송비옵션) 로 구분
  const addOptions = defaultShippingSet.shippingOptions.filter(
    (opt) => opt.shipping_set_type === 'add',
  );

  if (addOptions.length === 0) return 0;

  // 배송지에 해당하는 배송옵션만 골라냄
  const shippingOptions = filterDeliveryLimitedShippingOptions({
    address,
    shippingOptions: addOptions,
  });

  if (shippingOptions.length === 0) return 0;

  const optType = shippingOptions[0].shipping_opt_type;

  const cost = calculateShippingCostByOptType({
    optType,
    shippingOptions,
    itemOption,
  });
  return cost;
}

/** 장바구니 페이지에서 해당 배송비 정책에 부과될 배송비 계산
 * 장바구니 화면에서는 주소정보가 없으므로 특정지역정보를 가지고 있는 추가배송비는 고려하지 않는다
 * => 기본 배송세트(ShippingSet.default_yn === Y)의 배송옵션을 기준으로 계산 (주소, 배송방식 고려하지 않음)
 *
 * @param shippingGroup 장바구니상품에 적용된 배송비정책 shippingGroup & shippingSet & shippingOption & shippingCost
 * @param cartItems 해당 배송비정책과 연결된 장바구니상품들 cartItem & cartItemOption
 * @param withShippingCalculTypeFree 장바구니에 담긴 상품중 배송비정책 ShippingCalculType이 무료계산-묶음배송이 있는지 여부
 * */
export const calculateShippingCostInCartTable = ({
  shippingGroup,
  cartItems,
  withShippingCalculTypeFree,
}: {
  shippingGroup: GoodsByIdRes['ShippingGroup'];
  cartItems: Array<CartItem & { options: CartItemOption[] }>;
  withShippingCalculTypeFree?: boolean; // 동일 판매자의 shipping_calcul_type === 'free'인 다른 배송그룹상품과 같이 주문했는지 여부
}): ShippingOptionCost | null => {
  if (!cartItems.length) return null;
  const { shipping_calcul_type } = shippingGroup;

  const { isStdShippingCostFree } = checkShippingCostFree(
    shippingGroup,
    withShippingCalculTypeFree,
  );

  const shippingCost = {
    std: 0,
    add: 0,
  };

  // 배송비그룹 묶음계산-무료배송인경우 기본배송비 1번만 부과
  if (shipping_calcul_type === 'bundle') {
    // 전체 상품옵션개수, 상품옵션가격, 상품옵션무게 총합
    const optionsTotal = sumItemOptionValues(cartItems.flatMap((item) => item.options));
    if (!isStdShippingCostFree) {
      // shippingCost.std += Number(getStandardShippingCost(shippingGroup));
      shippingCost.std += Number(
        calculateStdShippingCost({
          shippingGroupData: shippingGroup,
          itemOption: optionsTotal,
        }),
      );
    }
  }

  // 배송비그룹 개별계산-개별배송인경우 상품별로 기본배송비 부과
  if (shipping_calcul_type === 'each') {
    // 장바구니 상품별로 주문가격, 개수, 무게 구한다
    const optionsTotalByItemList = cartItems.map((item) => {
      return {
        cartItemId: item.id,
        optionsTotal: sumItemOptionValues(item.options),
      };
    });

    if (!isStdShippingCostFree) {
      // 상품별로 기본배송비 부과
      optionsTotalByItemList.forEach((itemData) => {
        shippingCost.std += Number(
          calculateStdShippingCost({
            shippingGroupData: shippingGroup,
            itemOption: itemData.optionsTotal,
          }),
        );
      });
    }
  }

  return shippingCost;
};

/** 제주 및 도서산간지역인지 확인 */
export function checkRemoteArea({
  address,
  postalCode,
}: {
  address: string;
  postalCode: string;
}): boolean {
  let result = false;
  const remotePostalCodeList = Object.values(remoteAreaPostalcode);
  for (let i = 0; i < remotePostalCodeList.length; i++) {
    const code = remotePostalCodeList[i];
    if (Array.isArray(code)) {
      // 우편번호 범위(배열)인 경우
      const start = Number(code[0]);
      const end = Number(code[1]);
      if (start <= Number(postalCode) && end >= Number(postalCode)) {
        result = true;
        break;
      }
    }
    // 단일 우편번호인경우
    if (code === postalCode) {
      result = true;
      break;
    }
  }
  return result;
}

/** 주소변경시 실행하는 배송비계산 */
export function calculateShippingCost({
  postalCode,
  address,
  shippingGroupData,
  goodsOptions,
  withShippingCalculTypeFree,
}: {
  postalCode: string;
  address: string;
  shippingGroupData: ShippingGroupData;
  goodsOptions: (ShippingCheckItem & GoodsOptions)[];
  withShippingCalculTypeFree?: boolean; // 동일 판매자의 shipping_calcul_type === 'free'인 다른 배송그룹상품과 같이 주문했는지 여부
}): ShippingCostCalculatedType {
  // 2. 배송비그룹의 배송비계산방식에 따라 기본배송비, 추가배송비 부과
  const { shipping_calcul_type } = shippingGroupData;
  const { isStdShippingCostFree, isAddShippingCostFree } = checkShippingCostFree(
    shippingGroupData,
    withShippingCalculTypeFree,
  );

  // * 배송정책이 지역제한배송이고 기본배송비옵션 중 주어진 주소가 없는경우 배송불가지역으로 판단
  // *   => { isShippingAvailable: false, cost: null } 리턴함
  const isShippingAvailable = checkShippingAvailable({
    address,
    shippingGroupData,
    postalCode,
  });
  if (!isShippingAvailable) {
    return {
      isShippingAvailable: false,
      cost: null,
    };
  }

  // * 배송가능한 지역인경우 배송비 계산하기
  const result: {
    isShippingAvailable: boolean;
    cost: null | { std: number; add: number };
  } = {
    isShippingAvailable: true,
    cost: { std: 0, add: 0 },
  };

  const totalCnt = goodsOptions
    .map((opt) => opt.quantity)
    .reduce((sum, cur) => sum + cur, 0);
  const totalAmount = goodsOptions
    .map((opt) => Number(opt.price) * opt.quantity)
    .reduce((sum, cur) => sum + cur, 0);

  // 배송비그룹 묶음계산-무료배송인경우 기본배송비 1번만 부과, 추가배송비 1번만 부과
  if (shipping_calcul_type === 'bundle') {
    if (!isStdShippingCostFree) {
      const stdCost = calculateStdShippingCost({
        address,
        shippingGroupData,
        itemOption: { cnt: totalCnt, amount: totalAmount },
      });
      result.cost = { ...result.cost, std: stdCost };
    }
    if (!isAddShippingCostFree) {
      const addCost = calculateAddShippingCost({
        address,
        shippingGroupData,
        itemOption: { cnt: totalCnt, amount: totalAmount },
      });
      result.cost = { ...result.cost, add: addCost };
    }
  }
  // 배송비그룹 무료계산-묶음배송인 경우 기본배송비는 무료, 추가배송비 1번만 부과
  if (shipping_calcul_type === 'free') {
    if (!isAddShippingCostFree) {
      const addCost = calculateAddShippingCost({
        address,
        shippingGroupData,
        itemOption: { cnt: totalCnt, amount: totalAmount },
      });
      result.cost = { ...result.cost, add: addCost };
    }
  }
  // 배송비그룹 개별계산-개별배송인경우 상품별로 기본배송비와 추가배송비 부과
  if (shipping_calcul_type === 'each') {
    // 상품별로 주문가격, 개수, 무게 구한다
    const goodsIds = [...new Set(goodsOptions.map((opt) => opt.goodsId))];

    const optionsTotalByItemList = goodsIds.map((goodsId) => {
      const optionsByGoodsId = goodsOptions.filter((opt) => opt.goodsId === goodsId);
      return {
        cnt: optionsByGoodsId
          .map((opt) => opt.quantity)
          .reduce((sum, cur) => sum + cur, 0),
        amount: optionsByGoodsId
          .map((opt) => opt.quantity * Number(opt.price))
          .reduce((sum, cur) => sum + cur, 0),
      };
    });

    if (!isStdShippingCostFree) {
      // 상품별로 기본배송비 부과
      optionsTotalByItemList.forEach((_) => {
        const stdCost = calculateStdShippingCost({
          address,
          shippingGroupData,
          itemOption: { cnt: totalCnt, amount: totalAmount },
        });
        result.cost = { ...result.cost, std: result.cost.std + stdCost };
      });
    }
    if (!isAddShippingCostFree) {
      // 상품별로 추가배송비 부과
      optionsTotalByItemList.forEach((_) => {
        const addCost = calculateAddShippingCost({
          address,
          shippingGroupData,
          itemOption: { cnt: totalCnt, amount: totalAmount },
        });
        result.cost = { ...result.cost, add: result.cost.add + addCost };
      });
    }
  }

  return result;
}
