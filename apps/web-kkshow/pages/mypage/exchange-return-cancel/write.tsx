import { Heading } from '@chakra-ui/react';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { ExchangeReturnWriteSection } from '@project-lc/components-web-kkshow/mypage/exchange-return-cancel/ExchangeReturnWriteSection';

import { useRouter } from 'next/router';

export function ExchangeReturnWrite(): JSX.Element {
  const router = useRouter();
  const { orderId } = router.query;

  const _orderId = orderId ? Number(orderId) : undefined;

  return (
    <CustomerMypageLayout>
      <Heading size="sm">재배송/환불 신청(작성)페이지</Heading>

      <ExchangeReturnWriteSection orderId={_orderId} />
    </CustomerMypageLayout>
  );
}

export default ExchangeReturnWrite;
