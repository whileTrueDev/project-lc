import { PolicyTarget, PolicyCategory } from '@prisma/client';

export const POLICY_TARGET_USER: Record<PolicyTarget, string> = {
  seller: '판매자',
  broadcaster: '방송인',
  customer: '소비자',
  all: '전체',
};
export const POLICY_CATEGORY: Record<PolicyCategory, string> = {
  termsOfService: '이용약관',
  privacy: '개인정보처리방침',
};
