import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { useAdminOrder } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function OrderDetail(): JSX.Element {
  const router = useRouter();
  const { orderId } = router.query;
  console.log(orderId);
  const { data } = useAdminOrder(Number(orderId));
  console.log(data);
  return (
    <AdminPageLayout>
      {data && (
        <Box>
          <Flex>
            <Text>주문코드</Text>
            <Text>{data.orderCode}</Text>
          </Flex>
          <Flex>
            <Text>주문자명</Text>
            <Text>{data.ordererName}</Text>
          </Flex>
          <Flex>
            <Text>단계</Text>
            <Text>{data.step}</Text>
          </Flex>
          <Flex>
            <Text>주문코드</Text>
            <Text>{data.orderCode}</Text>
          </Flex>
          <Flex>
            <Text>주문코드</Text>
            <Text>{data.orderCode}</Text>
          </Flex>
        </Box>
      )}
    </AdminPageLayout>
  );
}

export default OrderDetail;
