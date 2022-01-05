import { TaxationType } from '@prisma/client';

export const TAX_TYPE: Record<TaxationType, string> = {
  naturalPerson: '개인(사업소득)',
  selfEmployedBusiness: '개인사업자',
};
