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
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import FmOrderStatusBadge from '@project-lc/components-shared/FmOrderStatusBadge';
import ShowMoreTextButton from '@project-lc/components-shared/ShowMoreTextButton';
import { useDisplaySize } from '@project-lc/hooks';
import { FmOrderOption } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { useMemo } from 'react';

/** 주문 옵션 목록 */
export function OrderDetailOptionList({
  options,
}: {
  options: FmOrderOption[];
}): JSX.Element {
  const displaySize = useDisplaySize();
  return (
    <Box mt={4}>
      {options.map((goodsOpt) => (
        <OrderDetailOptionListItem key={goodsOpt.item_option_seq} option={goodsOpt} />
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
  option: Pick<FmOrderOption, 'ea' | 'price' | 'option1' | 'title1' | 'step'>;
  withBadge?: boolean;
}): JSX.Element {
  const orderPrice = useMemo(() => {
    const price = Number(option.price) * Number(option.ea);
    return `${getLocaleNumber(price)} 원`;
  }, [option.ea, option.price]);
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="nowrap">
      {withBadge && <FmOrderStatusBadge orderStatus={option.step} />}
      {option.title1 && option.option1 && (
        <>
          <Text isTruncated>
            {option.title1}: {option.option1}
          </Text>
          <TextDotConnector />
        </>
      )}

      <Text isTruncated>{option.ea} 개</Text>
      <TextDotConnector />
      <Text isTruncated>{orderPrice}</Text>
    </Stack>
  );
}

/** 주문 옵션 목록 자세히보기 */
export function OrderDetailOptionDescription({
  options,
}: {
  options: FmOrderOption[];
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
                  <Th>
                    <FmOrderStatusBadge orderStatus="35" />
                  </Th>
                  <Th>
                    <FmOrderStatusBadge orderStatus="45" />
                  </Th>
                  <Th>
                    <FmOrderStatusBadge orderStatus="55" />
                  </Th>
                  <Th>
                    <FmOrderStatusBadge orderStatus="65" />
                  </Th>
                  <Th>
                    <FmOrderStatusBadge orderStatus="75" />
                  </Th>
                  <Th>
                    <FmOrderStatusBadge orderStatus="85" />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {options.map((opt) => (
                  <Tr key={opt.item_option_seq}>
                    {opt.title1 && opt.option1 ? (
                      <Td>
                        {opt.title1}: {opt.option1}
                      </Td>
                    ) : (
                      <Td>기본옵션</Td>
                    )}
                    <Td>{opt.ea} 개</Td>
                    <Td>{opt.step35}</Td>
                    <Td>{opt.step45}</Td>
                    <Td>{opt.step55}</Td>
                    <Td>{opt.step65}</Td>
                    <Td>{opt.step75}</Td>
                    <Td>{opt.step85}</Td>
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
