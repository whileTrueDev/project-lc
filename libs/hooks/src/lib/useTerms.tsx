import { Term } from '@project-lc/components-constants/termType';
import { usePolicy } from './queries/usePolicy';

/** 판매자, 방송인 시작가이드, 계정설정>이용동의 에서 사용되는 terms 데이터 조회 훅
 * 내부에 usePolicy 사용하여 db에서 가장 최신 정책내용을 조회한다
 */
export function useTerms({ userType }: { userType: 'seller' | 'broadcaster' }): {
  broadcasterTerms: Term[];
  sellerTerms: Term[];
  isLoading: boolean;
} {
  const { data: privacyData, isLoading: privacyDataLoading } = usePolicy({
    category: 'privacy',
    targetUser: userType,
  });
  const { data: serviceTermsData, isLoading: serviceTermsLoading } = usePolicy({
    category: 'termsOfService',
    targetUser: userType,
  });

  const broadcasterTerms = [
    {
      required: true,
      title: '크크쇼 이용 약관',
      state: 'checkedA',
      text: serviceTermsData?.content || '',
    },
    {
      required: true,
      title: '개인정보 처리방침',
      state: 'checkedB',
      text: privacyData?.content || '',
    },
  ];

  const sellerTerms = [
    {
      required: true,
      title: '크크쇼 이용 약관',
      state: 'sellerAgreementCheck',
      text: serviceTermsData?.content || '',
    },
  ];

  return {
    broadcasterTerms,
    sellerTerms,
    isLoading: privacyDataLoading || serviceTermsLoading,
  };
}
