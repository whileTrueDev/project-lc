import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { BsShopWindow } from 'react-icons/bs';

export interface DummyOrder {
  id: number;
  sellerId: number;
  shopName: string;
  goods_name: string;
  consumer_price: number;
  image: string;
  option_title: string;
  number: number;
  shipping_cost: number;
}

export function OrderItemInfo({ data }: { data: DummyOrder[] }): JSX.Element {
  const dummyOrder = data;
  return (
    <SectionWithTitle title="주문 상품">
      {dummyOrder.map((item) => (
        <Box key={item.id}>
          <HStack>
            <BsShopWindow />
            <Text>{item.shopName}</Text>
          </HStack>

          <Flex>
            <ChakraNextImage
              layout="intrinsic"
              src={`${item.image}`}
              width="100%"
              height="100%"
              rounded="md"
            />

            <Box>
              <Text fontSize="xs" ml={1}>
                {item.goods_name}
              </Text>
              <Flex direction="column" ml={1}>
                <Flex fontSize="xs">
                  <Text>옵션:</Text>
                  <Text>{item.option_title}</Text>
                </Flex>
                <Flex fontSize="xs">
                  <Text>구매수량:</Text>
                  <Text>{item.number}개</Text>
                </Flex>

                <Flex justifyContent="space-between">
                  <Box />
                  <Text fontWeight="bold">{item.consumer_price.toLocaleString()}원</Text>
                  {/* <Flex
                    w="100%"
                    h="100%"
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontWeight="bold">{item.shipping_cost.toLocaleString()}원</Text>
                    <Text as="sub">배송비</Text>
                  </Flex> */}
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </Box>
      ))}
    </SectionWithTitle>
  );
}
