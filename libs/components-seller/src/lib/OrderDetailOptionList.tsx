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
import { ExportBaseData } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { useMemo } from 'react';

/** 주문 옵션 목록 */
export function OrderDetailOptionList({
  options,
  exports,
}: {
  options: OrderItemOption[];
  exports: ExportBaseData[];
}): JSX.Element {
  const displaySize = useDisplaySize();
  return (
    <Box mt={4}>
      {options.map((goodsOpt) => (
        <OrderDetailOptionListItem key={goodsOpt.id} option={goodsOpt} />
      ))}

      {/* 태블릿 이상의 크기에서만 보여줌 */}
      {!displaySize.isMobileSize && (
        <OrderDetailOptionDescription options={options} exports={exports} />
      )}
    </Box>
  );
}
/** 주문 옵션 목록 아이템 */
export function OrderDetailOptionListItem({
  option,
  withBadge = true,
}: {
  option: OrderItemOption;
  withBadge?: boolean;
}): JSX.Element {
  const orderPrice = useMemo(() => {
    const price = Number(option.discountPrice) * Number(option.quantity);
    return `${getLocaleNumber(price)} 원`;
  }, [option.discountPrice, option.quantity]);
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="nowrap">
      {withBadge && <OrderStatusBadge step={option.step} />}
      <Text isTruncated>{option.goodsName}, </Text>
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
  exports,
}: {
  options: OrderItemOption[];
  exports: ExportBaseData[];
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
                  <Th>총 주문 수량</Th>
                  <Th>출고완료 수량</Th>
                </Tr>
              </Thead>
              <Tbody>
                {options.map((opt) => {
                  const exportItems = exports.flatMap((e) => e.items);
                  const currentOptionExportItems = exportItems.filter(
                    (ei) => ei.orderItemOptionId === opt.id,
                  );
                  const exportedCount = currentOptionExportItems
                    .map((ei) => ei.quantity)
                    .reduce((sum, cur) => sum + cur, 0);
                  return (
                    <Tr key={opt.id}>
                      {/* 상품명 & 옵션명 */}
                      {opt.name && opt.value ? (
                        <Td>
                          {opt.goodsName}, {opt.name}: {opt.value}
                        </Td>
                      ) : (
                        <Td>{opt.goodsName}, 기본옵션</Td>
                      )}
                      {/* 총 주문 수량 */}
                      <Td>{opt.quantity} 개</Td>
                      {/* 출고완료 수량 */}
                      <Td>{exportedCount}개</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

export default OrderDetailOptionList;
