import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Flex, Icon, Text } from '@chakra-ui/react';
import { useCart } from '@project-lc/hooks';
import { useCartStore } from '@project-lc/stores';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { useMemo } from 'react';
import { FaEquals } from 'react-icons/fa';

export function CartSummary(): JSX.Element | null {
  const { data } = useCart();
  const { selectedItems } = useCartStore();
  const calculated = useMemo(() => {
    return selectedItems.reduce(
      (prev, item) => {
        const itemprice = item.options.reduce(
          (p, n) => p + Number(n.normalPrice) * n.quantity,
          0,
        );
        const orderPrice = item.options.reduce(
          (p, n) => p + Number(n.discountPrice) * n.quantity,
          0,
        );
        return {
          totalGoodsPrice: prev.totalGoodsPrice + itemprice,
          totalShippingCost: prev.totalShippingCost + Number(item.shippingCost),
          totalOrderPrice: prev.totalOrderPrice + orderPrice,
          totalDiscountAmount: prev.totalDiscountAmount + (itemprice - orderPrice),
        };
      },
      {
        totalGoodsPrice: 0,
        totalDiscountAmount: 0,
        totalShippingCost: 0,
        totalOrderPrice: 0,
      },
    );
  }, [selectedItems]);

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
        <Text fontSize={{ base: 'md', md: 'xl' }} fontWeight="bold">
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
