import { Box, Center, Text } from '@chakra-ui/react';
import { DeliveryTrackingList } from '@project-lc/components-shared/delivery-tracking/DeliveryTracking';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { useRouter } from 'next/router';

export function ShippingTrackingIndex(): JSX.Element {
  const router = useRouter();
  const orderCode = router.query.orderCode as string;
  if (!orderCode)
    return (
      <CustomerMypageLayout title="배송 조회">
        <Box p={[2, 2, 4]}>
          <Center>
            <Text>잘못된 접근입니다</Text>
          </Center>
        </Box>
      </CustomerMypageLayout>
    );
  return (
    <CustomerMypageLayout title="배송 조회">
      <Box p={[2, 2, 4]}>
        <Text fontSize="xl" fontWeight="bold">
          배송 조회
        </Text>
        <DeliveryTrackingList orderCode={orderCode} />
      </Box>
    </CustomerMypageLayout>
  );
}

export default ShippingTrackingIndex;
