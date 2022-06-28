import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { Heading, Text } from '@chakra-ui/react';
import { AdminOrderRefundList } from '@project-lc/components-admin/order/refund/AdminOrderRefundList';
import { AdminReturnRequestList } from '@project-lc/components-admin/order/returnRequest/AdminReturnRequestList';

export default function OrderRefundIndex(): JSX.Element {
  return (
    <AdminPageLayout>
      <Heading>주문 환불(결제취소)처리</Heading>
      <Text>
        소비자 환불요청 중 판매자가 승인한 내역에 한해 관리자가 결제취소(토스페이먼츠
        결제취소요청)
      </Text>
      <AdminReturnRequestList />
      <AdminOrderRefundList />
    </AdminPageLayout>
  );
}
