import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import ExchangeReturnListSection from '@project-lc/components-web-kkshow/mypage/exchange-return-cancel/ExchangeReturnListSection';

export function ExchangeReturnIndex(): JSX.Element {
  return (
    <CustomerMypageLayout>
      재배송/환불 신청 내역 페이지
      <ExchangeReturnListSection />
    </CustomerMypageLayout>
  );
}

export default ExchangeReturnIndex;
