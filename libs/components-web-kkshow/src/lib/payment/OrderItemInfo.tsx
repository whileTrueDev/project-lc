import { Box, Heading, Grid, GridItem, Text, Link, Flex, Center } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';

export function OrderItemInfo({ data }): JSX.Element {
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
