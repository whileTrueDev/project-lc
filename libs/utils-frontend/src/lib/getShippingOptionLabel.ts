import { ShippingOptionDto } from '@project-lc/shared-types';

export function getShippingOptionLabel(
  item: ShippingOptionDto,
  suffix: string,
  isLastOption?: boolean,
): string {
  const { section_st: sectionStart, section_ed: sectionEnd, shipping_opt_type } = item;

  const startValue = sectionStart ? sectionStart.toLocaleString() : 1;
  const startLabel = '이상';
  const startSection = `${startValue} ${suffix} ${startLabel}`;

  const endValue = sectionEnd ? sectionEnd.toLocaleString() : '';
  const endLabel = shipping_opt_type.includes('_rep') && isLastOption ? '당' : '미만';
  const endSection = `${endValue} ${suffix} ${endLabel}`;

  return `${startSection} ~ ${endSection}`;
}
