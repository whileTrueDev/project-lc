import {
  Box,
  Heading,
  Grid,
  GridItem,
  Text,
  Link,
  Flex,
  Center,
  Divider,
  HStack,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { BsShopWindow } from 'react-icons/bs';
import { OrderDetailRes } from '@project-lc/shared-types';

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

export function ReceiptOrderItemInfo({
  data,
}: {
  data: OrderDetailRes['orderItems'];
}): JSX.Element {
  return (
    <Box>
      <Heading size="lg">주문상품</Heading>
      <Divider m={2} />

      {data?.map((item, index: number) => (
        <Box key={item.id}>
          <Grid templateColumns="repeat(10, 1fr)">
            <GridItem colSpan={10}>
              <HStack>
                <BsShopWindow />
                <Text>{item.goods.seller.sellerShop.shopName}</Text>
              </HStack>
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
                    src={`${item.goods.image[0].image}`}
                    width={70}
                    height={70}
                  />
                  <Flex direction="column" m={3}>
                    <Text>{item.goods.goods_name}</Text>
                    <Text mt={3} as="sub">
                      옵션 : {item.options[index].value}
                    </Text>
                  </Flex>
                </Flex>
              </Link>
            </GridItem>
            <GridItem>
              <Center w="100%" h="100%">
                <Text>{item.options[index].quantity}개</Text>
              </Center>
            </GridItem>
            <GridItem>
              <Center w="100%" h="100%">
                <Text fontWeight="bold">
                  {(
                    Number(item.options[index].normalPrice) -
                    Number(item.options[index].discountPrice)
                  ).toLocaleString()}
                  원
                </Text>
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
                <Text fontWeight="bold">{item.shippingCost.toLocaleString()}원</Text>
                <Text as="sub">배송비</Text>
              </Flex>
            </GridItem>
          </Grid>
        </Box>
      ))}
    </Box>
  );
}

export function MobileReceiptOrderItemInfo({
  data,
}: {
  data: OrderDetailRes['orderItems'];
}): JSX.Element {
  return (
    <Box>
      <Heading size="lg">주문상품</Heading>
      <Divider m={2} />
      {data.map((item, index: number) => (
        <Box key={item.id}>
          <Grid templateColumns="repeat(10, 1fr)">
            <GridItem colSpan={10}>
              <HStack>
                <BsShopWindow />
                <Text>{item.goods.seller.sellerShop.shopName}</Text>
              </HStack>
            </GridItem>
            <GridItem colSpan={2} mb={4}>
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
                  src={`${item.goods.image[0].image}`}
                  width="100%"
                  height="100%"
                />
              </Link>
              <Flex />
            </GridItem>
            <GridItem
              colSpan={8}
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              <Link
                w="100%"
                isTruncated
                href={`http://localhost:3000/goods/${item.id}`}
                fontWeight="bold"
                colorScheme="blue"
                isExternal
              >
                <Text fontSize="xs" ml={1}>
                  {item.goods.goods_name}
                </Text>
              </Link>
              <Flex direction="column" ml={1}>
                <Flex fontSize="xs">
                  <Text>옵션:</Text>
                  <Text>{item.options[index].value}</Text>
                </Flex>
                <Flex fontSize="xs">
                  <Text>구매수량:</Text>
                  <Text>{item.options[index].quantity}개</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Box />
                  <Text fontWeight="bold">
                    {(
                      Number(item.options[index].normalPrice) -
                      Number(item.options[index].discountPrice)
                    ).toLocaleString()}
                    원
                  </Text>
                </Flex>
              </Flex>
            </GridItem>
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
