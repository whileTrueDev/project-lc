import {
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Link,
  Text,
} from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { TextDotConnector } from '@project-lc/components-core/TextDotConnector';
import { OrderDetailRes } from '@project-lc/shared-types';
import { getCustomerWebHost } from '@project-lc/utils';
import { BsShopWindow } from 'react-icons/bs';

export function ReceiptOrderItemInfo({
  data,
}: {
  data: OrderDetailRes['orderItems'];
}): JSX.Element {
  return (
    <Box>
      <Text fontWeight="bold" fontSize="lg">
        주문상품
      </Text>
      <Divider m={2} />

      {data?.map((item) => (
        <Box key={item.id}>
          <Grid templateColumns="repeat(8, 2fr)" alignItems="start">
            <GridItem colSpan={8}>
              <HStack>
                <BsShopWindow />
                <Text>{item.goods.seller.sellerShop.shopName}</Text>
              </HStack>
            </GridItem>
            <GridItem colSpan={5} mb={4}>
              <Flex direction="row" alignItems="start" gap={2}>
                <ChakraNextImage
                  layout="intrinsic"
                  src={`${item.goods.image[0].image}`}
                  width={70}
                  height={70}
                  rounded="md"
                />
                <Flex direction="column" ml={1}>
                  <Link
                    isTruncated
                    isExternal
                    colorScheme="blue"
                    href={`${getCustomerWebHost()}/goods/${item.goods.id}`}
                  >
                    <Text fontWeight="bold">{item.goods.goods_name}</Text>
                  </Link>
                  {item.options.map((option) => (
                    <Flex key={option.id} fontSize="xs">
                      <Text as="span">옵션 : {option.value}</Text>
                      <TextDotConnector mr={2} ml={2} />
                      <Text>{option.quantity}개</Text>
                      <TextDotConnector mr={2} ml={2} />
                      <Text as="span">
                        {Number(option.discountPrice).toLocaleString()}원
                      </Text>
                    </Flex>
                  ))}

                  {item.support && (
                    <Box mt={2} fontSize="sm">
                      <Text fontWeight="bold">방송인 후원정보</Text>
                      <Flex align="start" gap={1}>
                        <Avatar src={item.support?.broadcaster.avatar || ''} size="sm" />
                        <Box>
                          <Text mt={2}>{item.support?.broadcaster.userNickname}</Text>
                          <Text>후원닉네임: {item.support?.nickname}</Text>
                          <Text>후원메시지: {item.support?.message}</Text>
                        </Box>
                      </Flex>
                    </Box>
                  )}
                </Flex>
              </Flex>
            </GridItem>
            <GridItem>
              <Center w="100%" h="100%">
                <Text fontWeight="bold">
                  {item.options
                    .map(
                      (option) => Number(option.discountPrice) * Number(option.quantity),
                    )
                    .reduce((prev, next) => prev + next)}
                  원
                </Text>
              </Center>
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
      <Text fontWeight="bold" fontSize="lg">
        주문상품
      </Text>
      <Divider m={2} />
      {data.map((item) => (
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
                href={`${getCustomerWebHost()}/goods/${item.goods.id}`}
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
                href={`${getCustomerWebHost()}/goods/${item.goods.id}`}
                fontWeight="bold"
                colorScheme="blue"
                isExternal
              >
                <Text fontSize="xs" ml={1}>
                  {item.goods.goods_name}
                </Text>
              </Link>
              <Flex direction="column" ml={1}>
                <Flex fontSize="xs" direction="column">
                  {item.options.map((option) => (
                    <Flex key={option.id} fontSize="xs">
                      <Text as="span">옵션 : {option.value}</Text>
                      <TextDotConnector mr={2} ml={2} />
                      <Text>{option.quantity}개</Text>
                      <TextDotConnector mr={2} ml={2} />
                      <Text as="span">
                        {Number(option.discountPrice).toLocaleString()}원
                      </Text>
                    </Flex>
                  ))}
                </Flex>
                <Flex fontSize="xs">
                  <Text>총 구매수량:</Text>
                  <Text>
                    {item.options
                      .map((option) => Number(option.quantity))
                      .reduce((prev, next) => prev + next)}
                    개
                  </Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Box />
                  <Text fontWeight="bold">
                    {item.options
                      .map(
                        (option) =>
                          Number(option.discountPrice) * Number(option.quantity),
                      )
                      .reduce((prev, next) => prev + next)}
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
