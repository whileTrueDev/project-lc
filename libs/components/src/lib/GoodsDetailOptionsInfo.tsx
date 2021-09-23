import { Box, Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { GoodsByIdRes } from '@project-lc/shared-types';

export interface GoodsDetailOptionsInfoProps {
  goods: GoodsByIdRes;
}

// TODO 모바일 화면에서는 Table이 아닌 형태로 보여주도록 변경 필요
export function GoodsDetailOptionsInfo({ goods }: GoodsDetailOptionsInfoProps) {
  return (
    <Stack>
      <Table mt={4}>
        <Thead>
          <Tr>
            <Th>기본옵션여부</Th>
            <Th>옵션명</Th>
            <Th>옵션값</Th>
            <Th>소비자가</Th>
            <Th>정가</Th>
            <Th>옵션노출여부</Th>
            <Th>총 재고</Th>
            <Th>불량재고</Th>
            <Th>가용재고</Th>
          </Tr>
        </Thead>
        <Tbody>
          {goods.options &&
            goods.options.map((option, index) => (
              <Tr key={option.id}>
                <Td borderBottom="none">
                  {option.default_option === 'y' ? '예' : '아니오'}
                </Td>
                <Td borderBottom="none">{option.option_title}</Td>
                <Td borderBottom="none">{option.option1}</Td>
                <Td borderBottom="none">
                  {Number(option.consumer_price).toLocaleString()}
                </Td>
                <Td borderBottom="none">{Number(option.price).toLocaleString()}</Td>
                <Td borderBottom="none">
                  {option.option_view === 'Y' ? '노출' : '미노출'}
                </Td>
                <Td borderBottom="none">{option.supply.stock}</Td>
                <Td borderBottom="none">{option.supply.badstock}</Td>
                <Td borderBottom="none">
                  {option.supply.stock - (option.supply.badstock || 0)}
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Stack>
  );
}
