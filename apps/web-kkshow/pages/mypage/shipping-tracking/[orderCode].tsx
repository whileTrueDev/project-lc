import { Box, Center, Spinner, Text } from '@chakra-ui/react';
import { DeliveryTrackingList } from '@project-lc/components-shared/delivery-tracking/DeliveryTracking';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { OrderInfoGiftExportsItem } from '@project-lc/components-web-kkshow/mypage/order/OrderInfoExportsList';
import { useOrderDetail } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function ShippingTrackingIndex(): JSX.Element {
  const router = useRouter();
  const orderCode = router.query.orderCode as string;
  const orderDetail = useOrderDetail({ orderCode });

  if (orderDetail.isLoading) {
    return (
      <CustomerMypageLayout title="배송 조회">
        <Center>
          <Spinner />
        </Center>
      </CustomerMypageLayout>
    );
  }
  if (!orderCode || !orderDetail.data)
    return (
      <CustomerMypageLayout title="배송 조회">
        <Box p={[2, 2, 4]}>
          <Center>
            <Text>잘못된 접근입니다</Text>
          </Center>
        </Box>
      </CustomerMypageLayout>
    );

  if (orderDetail.data.giftFlag) {
    return (
      <CustomerMypageLayout title="배송 조회">
        <Box p={[2, 2, 4]}>
          <Text fontSize="xl" fontWeight="bold">
            배송 조회
          </Text>
          <OrderInfoGiftExportsItem
            order={orderDetail.data}
            exports={orderDetail.data.exports}
          />
        </Box>
      </CustomerMypageLayout>
    );
  }

  return (
    <CustomerMypageLayout title="배송 조회">
      <Box p={[2, 2, 4]}>
        <Text fontSize="xl" fontWeight="bold">
          배송 조회
        </Text>
        {orderDetail.data.exports.map((exp) => (
          <DeliveryTrackingList key={exp.exportCode} exportCode={exp.exportCode} />
        ))}
      </Box>
    </CustomerMypageLayout>
  );
}

export default ShippingTrackingIndex;
