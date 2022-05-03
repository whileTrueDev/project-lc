import { Box, Heading, Grid, GridItem, Text, Link, Flex, Center } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';

interface DummyOrder {
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
    <Box>
      <Heading>주문상품</Heading>

      {dummyOrder.map((item) => (
        <Box key={item.id}>
          <Grid templateColumns="repeat(10, 1fr)">
            <GridItem colSpan={10}>
              <Text>판매자 : {item.shopName}</Text>
            </GridItem>
            <GridItem colSpan={5} mb={4}>
              <Link
                isTruncated
                href={`http://localhost:3000/goods/${item.id}`}
                fontWeight="bold"
                colorScheme="blue"
                isExternal
              >
                <Flex direction="row" alignItems="center">
                  <ChakraNextImage
                    layout="intrinsic"
                    src={`${item.image}`}
                    width={70}
                    height={70}
                  />
                  <Flex direction="column" m={3}>
                    <Text>{item.goods_name}</Text>
                    <Text mt={3} as="sub">
                      옵션 : {item.option_title}
                    </Text>
                  </Flex>
                </Flex>
              </Link>
            </GridItem>
            <GridItem>
              <Center w="100%" h="100%">
                <Text>{item.number}개</Text>
              </Center>
            </GridItem>
            <GridItem>
              <Center w="100%" h="100%">
                <Text fontWeight="bold">{item.consumer_price.toLocaleString()}원</Text>
              </Center>
            </GridItem>
            <GridItem>
              <Flex
                w="100%"
                h="100%"
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontWeight="bold">{item.shipping_cost.toLocaleString()}원</Text>
                <Text as="sub">배송비</Text>
              </Flex>
            </GridItem>
          </Grid>
        </Box>
      ))}
    </Box>
  );
}

export function MobileOrderItemInfo({ data }: { data: DummyOrder[] }): JSX.Element {
  const dummyOrder = data;
  return (
    <Box>
      <Heading>주문상품</Heading>

      {dummyOrder.map((item) => (
        <Box key={item.id}>
          <Grid templateColumns="repeat(10, 1fr)">
            <GridItem colSpan={10}>
              <Text>판매자 : {item.shopName}</Text>
            </GridItem>
            <GridItem colSpan={3} mb={4}>
              <Link
                w="100%"
                isTruncated
                href={`http://localhost:3000/goods/${item.id}`}
                fontWeight="bold"
                colorScheme="blue"
                isExternal
              >
                <ChakraNextImage
                  layout="intrinsic"
                  src={`${item.image}`}
                  width="100%"
                  height="100%"
                />
              </Link>
              <Flex />
            </GridItem>
            <GridItem colSpan={7}>
              <Link
                w="100%"
                isTruncated
                href={`http://localhost:3000/goods/${item.id}`}
                fontWeight="bold"
                colorScheme="blue"
                isExternal
              >
                <Text fontSize="sm">{item.goods_name}</Text>
              </Link>
              <Flex direction="column" mt={3}>
                <Flex fontSize="xs">
                  <Text>옵션:</Text>
                  <Text>{item.option_title}</Text>
                </Flex>
                <Flex fontSize="xs">
                  <Text>구매수량:</Text>
                  <Text>{item.number}개</Text>
                </Flex>
                <Text fontWeight="bold">{item.consumer_price.toLocaleString()}원</Text>
              </Flex>
            </GridItem>
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
