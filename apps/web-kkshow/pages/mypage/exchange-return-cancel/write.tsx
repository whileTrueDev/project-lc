import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { ExchangeReturnWriteSection } from '@project-lc/components-web-kkshow/mypage/exchange-return-cancel/ExchangeReturnWriteSection';

import { useRouter } from 'next/router';

export function ExchangeReturnWrite(): JSX.Element {
  const router = useRouter();
  const { orderId, optionId } = router.query;

  const _orderId = orderId ? Number(orderId) : undefined;
  const _optionId = optionId ? Number(optionId) : undefined; // 재배송/반품요청 클릭한 상품옵션 -> 동일한 판매자의 상품만 표시하기 위해 전달함

  return (
    <CustomerMypageLayout title="재배송/환불 신청">
      <ExchangeReturnWriteSection orderId={_orderId} optionId={_optionId} />
    </CustomerMypageLayout>
  );
}

export default ExchangeReturnWrite;
