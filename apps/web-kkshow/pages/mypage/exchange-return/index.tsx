import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import ExchangeReturnList from '@project-lc/components-web-kkshow/mypage/exchange-return/ExchangeReturnList';

export function ExchangeReturnIndex(): JSX.Element {
  return (
    <CustomerMypageLayout>
      재배송/환불 신청 내역 페이지
      <ExchangeReturnList />
    </CustomerMypageLayout>
  );
}

export default ExchangeReturnIndex;
