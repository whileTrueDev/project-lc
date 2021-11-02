import { FmOrderExport } from '../res-types/fmOrder.res';

export const fmDeliveryCompanies: Record<
  FmOrderExport['delivery_company_code'],
  { name: string }
> = {
  code0: { name: 'CJ GLS' },
  code1: { name: 'DHL코리아' },
  code2: { name: 'KGB택배' },
  code3: { name: '경동택배' },
  code4: { name: '대한통운' },
  code5: { name: '동부택배(훼밀리)' },
  code6: { name: '로젠택배' },
  code7: { name: '우체국택배' },
  code8: { name: '하나로택배' },
  code9: { name: '한진택배' },
  code10: { name: '롯데택배' },
  code11: { name: '동원택배' },
  code12: { name: '대신택배' },
  code13: { name: '세덱스' },
  code14: { name: '동부익스프레스' },
  code15: { name: '천일택배' },
  code16: { name: '사가와택배' },
  code17: { name: '일양택배' },
  code18: { name: '이노지스' },
  code19: { name: '편의점택배' },
  code20: { name: '건영택배' },
  code21: { name: '엘로우캡' },
};

export const convertFmDeliveryCompanyToString = (
  companyCode: string | null,
): string | null => {
  if (!companyCode) return null;
  if (!fmDeliveryCompanies[companyCode]) return null;
  return fmDeliveryCompanies[companyCode].name;
};
