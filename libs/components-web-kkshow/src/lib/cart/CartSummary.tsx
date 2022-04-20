import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Box, Flex, Icon, Text } from '@chakra-ui/react';
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
      my={6}
      py={10}
      px={6}
      justify="space-between"
      alignItems="center"
      borderWidth="thin"
      rounded="lg"
    >
      <Box textAlign="center">
        <Text>총 상품 금액</Text>
        <Text fontSize="xl" fontWeight="bold">
          {getLocaleNumber(calculated.totalGoodsPrice)}
        </Text>
      </Box>

      <MinusIcon />

      <Box textAlign="center">
        <Text>총 할인 금액</Text>
        <Text fontSize="xl" fontWeight="bold">
          {getLocaleNumber(calculated.totalDiscountAmount)}
        </Text>
      </Box>

      <AddIcon />

      <Box textAlign="center">
        <Text>총 배송비</Text>
        <Text fontSize="xl" fontWeight="bold">
          {getLocaleNumber(calculated.totalShippingCost)}
        </Text>
      </Box>

      <Icon as={FaEquals} />

      <Box textAlign="center">
        <Text>총 주문 금액</Text>
        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
          {getLocaleNumber(calculated.totalOrderPrice + calculated.totalShippingCost)}
        </Text>
      </Box>
    </Flex>
  );
}

export default CartSummary;
