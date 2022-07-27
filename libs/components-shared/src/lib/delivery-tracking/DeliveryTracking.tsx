import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  Image,
  Link,
  Text,
} from '@chakra-ui/react';
import { Order } from '@prisma/client';
import { useExports } from '@project-lc/hooks';
import { ExportListItem } from '@project-lc/shared-types';
import { deliveryCompanies, getLocaleNumber } from '@project-lc/utils-frontend';
import { useMemo } from 'react';
import { FaShippingFast } from 'react-icons/fa';
import { OrderStatusBadge } from '../order/OrderStatusBadge';

export interface DeliveryTrackingProps {
  exportData: ExportListItem;
}
export function DeliveryTracking({ exportData }: DeliveryTrackingProps): JSX.Element {
  return (
    <Box p={2} rounded="md" borderWidth="thin">
      <Box mb={4}>
        <Text as="span" fontSize="sm">
          {exportData.exportCode}
        </Text>
      </Box>

      <DeliveryTrackingButton
        deliveryCompany={exportData.deliveryCompany}
        deliveryNumber={exportData.deliveryNumber}
      />

      <Flex gap={3} flexWrap="wrap">
        <Box>
          <Text fontWeight="bold">택배사</Text>
          <Text>{exportData.deliveryCompany}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">송장 번호</Text>
          <Text>{exportData.deliveryNumber}</Text>
        </Box>
      </Flex>

      <Flex gap={3} flexWrap="wrap" mt={4}>
        <Box>
          <Text fontWeight="bold">받는사람</Text>
          <Text>{exportData.order.recipientName}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">받는주소</Text>
          <Text>{exportData.order.recipientAddress}</Text>
          <Text>{exportData.order.recipientDetailAddress}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">배송요청사항</Text>
          <Text>{exportData.order.memo}</Text>
        </Box>
      </Flex>

      <Flex gap={3} flexWrap="wrap" mt={4}>
        {exportData.items.map((exportItem) => (
          <Flex key={exportItem.id} gap={2}>
            <Image
              src={exportItem.image}
              w="40px"
              h="40px"
              objectFit="cover"
              rounded="md"
              draggable={false}
            />
            <Box>
              <OrderStatusBadge step={exportItem.status} />
              <Text>{exportItem.goodsName}</Text>
              <Flex gap={2} fontSize="sm">
                <Text>{exportItem.title1}:</Text>
                <Text>{exportItem.option1}</Text>
                <Text>{exportItem.quantity}개</Text>
              </Flex>
              <Text fontSize="sm">총 {getLocaleNumber(exportItem.price)}원</Text>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}

interface DeliveryTrackingButtonProps {
  deliveryCompany: string;
  deliveryNumber: string;
  enableWarning?: boolean;
}
export function DeliveryTrackingButton({
  deliveryCompany,
  deliveryNumber,
  enableWarning = false,
}: DeliveryTrackingButtonProps): JSX.Element | null {
  const targetCompany = useMemo(
    () => deliveryCompanies.find((x) => x.company === deliveryCompany, []),
    [deliveryCompany],
  );

  if (!targetCompany && enableWarning)
    return (
      <Alert status="warning" mb={4} maxW={400} fontSize="sm">
        <AlertIcon />
        <AlertDescription>
          <Text>죄송합니다. 배송 조회 기능이 아직 개발중입니다.</Text>
          <Text>
            택배사와 송장번호를 검색하거나 해당 택배사 홈페이지에서 확인하시기 바랍니다.
          </Text>
        </AlertDescription>
      </Alert>
    );
  if (!targetCompany) return null;
  return (
    <Box my={2}>
      <Button
        as={Link}
        isExternal
        href={targetCompany.url + deliveryNumber}
        rightIcon={<FaShippingFast />}
        colorScheme="blue"
        size="sm"
      >
        {targetCompany.company} 배송조회
      </Button>
    </Box>
  );
}

export default DeliveryTracking;

interface DeliveryTrackingListProps {
  orderCode: Order['orderCode'];
}
export function DeliveryTrackingList({
  orderCode,
}: DeliveryTrackingListProps): JSX.Element {
  const exportsData = useExports(
    { orderCode: orderCode || '' },
    { enabled: !!orderCode },
  );
  return (
    <Box mt={4} mb={40}>
      {exportsData.data?.list.map((exp) => (
        <DeliveryTracking key={exp.exportCode} exportData={exp} />
      ))}
    </Box>
  );
}
