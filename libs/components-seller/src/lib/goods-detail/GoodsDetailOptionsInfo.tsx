import {
  Box,
  Flex,
  SimpleGrid,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import { GoodsByIdRes } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';

export interface GoodsDetailOptionsInfoProps {
  goods: GoodsByIdRes;
}

export function GoodsDetailOptionsInfo({
  goods,
}: GoodsDetailOptionsInfoProps): JSX.Element | null {
  const { isMobileSize, isDesktopSize, isMiddleSize } = useDisplaySize();

  if (isMobileSize) {
    return (
      <Box>
        {goods.options &&
          goods.options.map((option) => (
            <Box key={option.id} mt={6}>
              {option.option_title && option.option1 && (
                <Flex alignItems="center">
                  <Text fontSize="lg" fontWeight="bold">
                    {option.option_title}: {option.option1}
                  </Text>
                </Flex>
              )}
              <SimpleGrid mt={2} columns={{ base: 2, sm: 3 }}>
                <Box>
                  <Text fontWeight="bold">기본옵션</Text>
                  <Text>{option.default_option === 'y' ? '예' : '아니오'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">소비자가</Text>
                  <Text>{getLocaleNumber(option.consumer_price)}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">정가</Text>
                  <Text>{getLocaleNumber(option.price)}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">옵션노출여부</Text>
                  <Text>{option.option_view === 'Y' ? '노출' : '미노출'}</Text>
                </Box>
                {/* [상품 옵션] 재고 기능 임시 제거 */}
                {/* <Box>
                  <Text fontWeight="bold">총 재고</Text>
                  <Text>{option.supply.stock}</Text>
                </Box>
                {option.supply.badstock ? (
                  <Box>
                    <Text fontWeight="bold">불량재고</Text>
                    <Text>{option.supply.badstock}</Text>
                  </Box>
                ) : null}
                <Box>
                  <Text fontWeight="bold">가용재고</Text>
                  <Text>{option.supply.stock - (option.supply.badstock || 0)}</Text>
                </Box> */}
              </SimpleGrid>
            </Box>
          ))}
      </Box>
    );
  }

  if (isDesktopSize || isMiddleSize) {
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
              {/* [상품 옵션] 재고 기능 임시 제거 */}
              {/* <Th>총 재고</Th>
              <Th>불량재고</Th>
              <Th>가용재고</Th> */}
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
                  <Td borderBottom="none">
                    <Flex alignItems="center">{option.option1}</Flex>
                  </Td>
                  <Td borderBottom="none">{getLocaleNumber(option.consumer_price)}</Td>
                  <Td borderBottom="none">{getLocaleNumber(option.price)}</Td>
                  <Td borderBottom="none">
                    {option.option_view === 'Y' ? '노출' : '미노출'}
                  </Td>
                  {/* [상품 옵션] 재고 기능 임시 제거 */}
                  {/* <Td borderBottom="none">{option.supply.stock}</Td>
                  <Td borderBottom="none">{option.supply.badstock}</Td>
                  <Td borderBottom="none">
                    {option.supply.stock - (option.supply.badstock || 0)}
                  </Td> */}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Stack>
    );
  }
  return null;
}
