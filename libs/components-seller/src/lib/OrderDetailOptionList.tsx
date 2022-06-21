import {
  Box,
  Collapse,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { OrderItemOption } from '@prisma/client';
import TextDotConnector from '@project-lc/components-core/TextDotConnector';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import ShowMoreTextButton from '@project-lc/components-shared/ShowMoreTextButton';
import { useDisplaySize } from '@project-lc/hooks';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { useMemo } from 'react';

/** 주문 옵션 목록 */
export function OrderDetailOptionList({
  options,
}: {
  options: OrderItemOption[];
}): JSX.Element {
  const displaySize = useDisplaySize();
  return (
    <Box mt={4}>
      {options.map((goodsOpt) => (
        <OrderDetailOptionListItem key={goodsOpt.id} option={goodsOpt} />
      ))}

      {/* 태블릿 이상의 크기에서만 보여줌 */}
      {!displaySize.isMobileSize && <OrderDetailOptionDescription options={options} />}
    </Box>
  );
}
/** 주문 옵션 목록 아이템 */
export function OrderDetailOptionListItem({
  option,
  withBadge = true,
}: {
  option: Pick<OrderItemOption, 'quantity' | 'discountPrice' | 'value' | 'name' | 'step'>;
  withBadge?: boolean;
}): JSX.Element {
  const orderPrice = useMemo(() => {
    const price = Number(option.discountPrice) * Number(option.quantity);
    return `${getLocaleNumber(price)} 원`;
  }, [option.discountPrice, option.quantity]);
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="nowrap">
      {withBadge && <OrderStatusBadge step={option.step} />}
      {option.name && option.value && (
        <>
          <Text isTruncated>
            {option.name}: {option.value}
          </Text>
          <TextDotConnector />
        </>
      )}

      <Text isTruncated>{option.quantity} 개</Text>
      <TextDotConnector />
      <Text isTruncated>{orderPrice}</Text>
    </Stack>
  );
}

/** 주문 옵션 목록 자세히보기 */
export function OrderDetailOptionDescription({
  options,
}: {
  options: OrderItemOption[];
}): JSX.Element {
  const { isOpen, onToggle } = useDisclosure({});
  return (
    <Box mt={2}>
      <ShowMoreTextButton onClick={onToggle} isOpen={isOpen} />

      <Collapse in={isOpen} animateOpacity unmountOnExit>
        <Box mt={2}>
          <Box my={2}>
            <Text fontWeight="bold">상품별(옵션별) 상태</Text>
            <Table>
              <Thead>
                <Tr>
                  <Th>상품</Th>
                  <Th>총 수량</Th>
                </Tr>
              </Thead>
              <Tbody>
                {options.map((opt) => (
                  <Tr key={opt.id}>
                    {opt.name && opt.value ? (
                      <Td>
                        {opt.name}: {opt.value}
                      </Td>
                    ) : (
                      <Td>기본옵션</Td>
                    )}
                    <Td>{opt.quantity} 개</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

export default OrderDetailOptionList;
