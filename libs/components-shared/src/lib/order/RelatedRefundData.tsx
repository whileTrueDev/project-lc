import { Stack, Text } from '@chakra-ui/react';
import { Refund } from '@prisma/client';

/** 환불, 주문취소에 연결된 환불정보 표시
 // TODO: 임의로 환불 예정/완료금액만 표시함. 기획 요청에 따라 필요한 데이터 추가 & 디자인 적용필요
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
      <Stack pl={4}>
        {refund ? (
          <Stack>
            <Text>환불 완료 금액 :</Text>
            <Text>{refund.refundAmount.toLocaleString()}원</Text>
          </Stack>
        ) : (
          <Stack>
            <Text>환불 예정 금액 :</Text>
            <Text>{estimatedRefundAmount.toLocaleString()}원</Text>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default RelatedRefundData;