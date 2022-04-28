import { Box, Heading, Grid, GridItem, Text, Link, Flex, Center } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { time } from 'console';

const dummyOrder = [
  {
    id: 1,
    sellerId: 1,
    shopName: '가게가게가',
    goods_name: '[음바쿠 - 김치찌개] 김치 김치찌개 김치찜',
    consumer_price: 19200,
    image: 'https://picsum.photos/300/300',
    option_title: '매운맛',
    number: 1,
    shipping_cost: 3000,
  },
  {
    id: 2,
    sellerId: 1,
    shopName: '가게가게가',
    goods_name: '[음바쿠 - 김치찌개] 된장찌개 김치찜',
    consumer_price: 39200,
    image: 'https://picsum.photos/300/301',
    option_title: '간장맛',
    number: 2,
    shipping_cost: 3000,
  },
];

export function OrderItemInfo(): JSX.Element {
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
                <Text fontWeight="bold">{item.consumer_price}원</Text>
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
                <Text fontWeight="bold">{item.shipping_cost}원</Text>
                <Text as="sub">배송비</Text>
              </Flex>
            </GridItem>
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
