type getDiscountedRateOptions = {
  fixedPoint?: number;
  includeSuffix?: boolean;
  suffix?: string | '%';
};

/**
 * 월래가격과 할인된 가격사이의 할인율을 반환합니다.
 * @param originalPrice 원래 가격
 * @param discountedPrice 할인된 가격
 * @returns 할인율 문자열
 */
export function getDiscountedRate(
  originalPrice: number,
  discountedPrice: number,
  options?: getDiscountedRateOptions,
): string {
  const { fixedPoint = 0, includeSuffix = false, suffix = '%' } = options || {};
  const result = (((originalPrice - discountedPrice) / originalPrice) * 100).toFixed(
    fixedPoint,
  );
  if (includeSuffix) return result + suffix;
  return result;
}

export default getDiscountedRate;
