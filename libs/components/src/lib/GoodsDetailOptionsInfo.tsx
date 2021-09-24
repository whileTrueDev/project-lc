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
import { GoodsByIdRes } from '@project-lc/shared-types';
import { useDisplaySize } from '../../../hooks/src';

export interface GoodsDetailOptionsInfoProps {
  goods: GoodsByIdRes;
}

export function GoodsDetailOptionsInfo({ goods }: GoodsDetailOptionsInfoProps) {
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
                  {option.color ? (
                    <Box
                      ml={1}
                      w="16px"
                      h="16px"
                      bgColor={option.color}
                      border="1px solid gray"
                    />
                  ) : null}
                </Flex>
              )}
              <SimpleGrid mt={2} columns={{ base: 2, sm: 3 }}>
                <Box>
                  <Text fontWeight="bold">기본옵션</Text>
                  <Text>{option.default_option === 'y' ? '예' : '아니오'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">소비자가</Text>
                  <Text>{Number(option.consumer_price).toLocaleString()}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">정가</Text>
                  <Text>{Number(option.price).toLocaleString()}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">옵션노출여부</Text>
                  <Text>{option.option_view === 'Y' ? '노출' : '미노출'}</Text>
                </Box>
                <Box>
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
                </Box>
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
  return null;
}
