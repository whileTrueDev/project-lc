import { Stack, Text } from '@chakra-ui/react';
import { Refund } from '@prisma/client';
import { getLocaleNumber } from '@project-lc/utils-frontend';

/** 환불, 주문취소에 연결된 환불정보 표시
 */
export interface RelatedRefundDataProps {
  refund?: Refund | null;
  estimatedRefundAmount: number;
}
export function RelatedRefundData({
  refund,
  estimatedRefundAmount,
}: RelatedRefundDataProps): JSX.Element {
  return (
    <Stack>
      <Text fontWeight="bold">환불안내</Text>
      <Stack>
        {refund ? (
          <Stack spacing={0}>
            <Text fontWeight="bold">환불 완료 금액</Text>
            <Text>{getLocaleNumber(refund.refundAmount)}원</Text>
            {refund.refundAccount && refund.refundAccountHolder && refund.refundBank && (
              <>
                <Text fontWeight="bold">환불 계좌 정보</Text>
                <Text>
                  {refund.refundBank} {refund.refundAccount}
                </Text>
                <Text>예금주: {refund.refundAccountHolder}</Text>
              </>
            )}
          </Stack>
        ) : (
          <Stack>
            <Text>환불 예정 금액 :</Text>
            <Text>{getLocaleNumber(estimatedRefundAmount)}원</Text>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default RelatedRefundData;
