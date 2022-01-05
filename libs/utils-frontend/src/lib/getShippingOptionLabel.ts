import { ShippingOptionDto } from '@project-lc/shared-types';

export function getShippingOptionLabel(item: ShippingOptionDto, suffix: string): string {
  const { section_st: sectionStart, section_ed: sectionEnd } = item;

  const startLabel = sectionStart
    ? `${sectionStart.toLocaleString()} ${suffix} 이상`
    : `0 ${suffix} 이상`;
  const endLabel = sectionEnd ? `${sectionEnd.toLocaleString()} ${suffix} 미만` : '';

  return `${startLabel} ~ ${endLabel}`;
}
