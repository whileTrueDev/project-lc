import { Stack, Text } from '@chakra-ui/react';

export interface AdminOrderRefundListProps {
  propname?: any;
}

/**  */
export function AdminOrderRefundList({
  propname,
}: AdminOrderRefundListProps): JSX.Element {
  return (
    <Stack>
      <Text>관리자가 처리한 환불요청 내역 & 환불처리 결과 조회</Text>
    </Stack>
  );
}

export default AdminOrderRefundList;
