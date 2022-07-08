import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Flex, Icon, Text } from '@chakra-ui/react';
import { useCart, useCartCalculatedMetrics } from '@project-lc/hooks';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { FaEquals } from 'react-icons/fa';

export function CartSummary(): JSX.Element | null {
  const { data } = useCart();
  const calculated = useCartCalculatedMetrics();

  if (!data || data.length === 0) return null;
  return (
    <Flex
      mt={{ base: 2, md: 6 }}
      mb={6}
      py={{ base: 4, md: 10 }}
      px={{ base: 4, md: 6 }}
      justify="space-between"
      alignItems="center"
      borderWidth="thin"
      rounded="lg"
      flexDir={{ base: 'column', md: 'row' }}
      gap={2}
    >
      <Flex
        display={{ base: 'flex', md: 'block' }}
        textAlign="center"
        justify="space-between"
        w="100%"
      >
        <Text fontSize="sm">총 상품 금액</Text>
        <Text fontSize={{ base: 'md', md: 'xl' }} fontWeight="bold">
          {getLocaleNumber(calculated.totalGoodsPrice)}원
        </Text>
      </Flex>

      <Flex
        display={{ base: 'none', md: 'block' }}
        textAlign="center"
        flexDir="row-reverse"
        w="100%"
      >
        <MinusIcon />
      </Flex>

      <Flex
        display={{ base: 'flex', md: 'block' }}
        textAlign="center"
        justify="space-between"
        w="100%"
      >
        <Text fontSize="sm">총 할인 금액</Text>
        <Text fontSize={{ base: 'md', md: 'xl' }} fontWeight="bold" color="red">
          <Text as="span" visibility={{ base: 'visible', md: 'hidden' }}>
            -
          </Text>
          {getLocaleNumber(calculated.totalDiscountAmount)}원
        </Text>
      </Flex>

      <Flex
        display={{ base: 'none', md: 'block' }}
        textAlign="center"
        flexDir="row-reverse"
        w="100%"
      >
        <AddIcon />
      </Flex>

      <Flex
        display={{ base: 'flex', md: 'block' }}
        textAlign="center"
        justify="space-between"
        w="100%"
      >
        <Text fontSize="sm">총 배송비</Text>
        <Text fontSize={{ base: 'md', md: 'xl' }} fontWeight="bold">
          {getLocaleNumber(calculated.totalShippingCost)}원
        </Text>
      </Flex>

      <Flex
        display={{ base: 'none', md: 'block' }}
        textAlign="center"
        flexDir="row-reverse"
        w="100%"
      >
        <Icon as={FaEquals} />
      </Flex>

      <Flex
        display={{ base: 'flex', md: 'block' }}
        textAlign="center"
        justify="space-between"
        w="100%"
      >
        <Text fontSize="sm">총 주문 금액</Text>
        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
          {getLocaleNumber(calculated.totalOrderPrice + calculated.totalShippingCost)}원
        </Text>
      </Flex>
    </Flex>
  );
}

export default CartSummary;
