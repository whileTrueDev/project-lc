import { AddIcon, CheckIcon, CloseIcon, DeleteIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  Flex,
  IconButton,
  Image,
  Link,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import {
  CartItem as CartItemType,
  CartItemOption,
  CartItemOption as CartItemOptionType,
} from '@prisma/client';
import BorderedAvatar from '@project-lc/components-core/BorderedAvatar';
import {
  useCart,
  useCartItemDeleteMutation,
  useCartItemOptDeleteMutation,
  useCartOptionQuantity,
  useCartTruncateMutation,
} from '@project-lc/hooks';
import { CartItemRes } from '@project-lc/shared-types';
import { useCartStore } from '@project-lc/stores';
import { getCartKey, getLocaleNumber } from '@project-lc/utils-frontend';
import NextLink from 'next/link';
import { useEffect, useMemo } from 'react';
import shallow from 'zustand/shallow';

export function CartTable(): JSX.Element {
  const { data, isLoading } = useCart();
  const { selectedItems, handleSelectAll, handleUnselectAll } = useCartStore(
    (s) => ({
      selectedItems: s.selectedItems,
      handleSelectAll: s.handleSelectAll,
      handleUnselectAll: s.handleUnselectAll,
    }),
    shallow,
  );

  // 카트 모두 비우기 핸들러
  const truncate = useCartTruncateMutation();
  const handleTruncate = async (): Promise<void> => {
    // TODO 소비자 로그인 구현 이후 profile 통해 올바른 customerId전달
    await truncate.mutateAsync(1);
  };

  // 렌더링시 장바구니 상품 모두 선택
  useEffect(() => {
    if (data) handleSelectAll(data);
    getCartKey(); // 장바구니 식별 키 생성 (없는 경우에만 생성됨)
  }, [handleSelectAll, data]);

  if (isLoading)
    return (
      <Center my={12}>
        <Spinner />
      </Center>
    );
  if (!isLoading && (!data || (data && data.length === 0)))
    return (
      <Box my={12}>
        <Center>
          <Text fontSize="lg">아직 장바구니에 담은 상품이 없습니다.</Text>
        </Center>
      </Box>
    );

  return (
    <Box>
      <Box mt={6}>
        <Text fontSize="lg">
          총 선택된 상품 {selectedItems.length} / {data.length}
        </Text>
      </Box>

      <Box py={6}>
        <ButtonGroup size="sm">
          <Button
            leftIcon={selectedItems.length === 0 ? <CheckIcon /> : <CloseIcon />}
            onClick={() => {
              if (selectedItems.length > 0) handleUnselectAll();
              else handleSelectAll(data);
            }}
          >
            전체{selectedItems.length === 0 ? '선택' : '해제'}
          </Button>
          <Button
            leftIcon={<DeleteIcon />}
            onClick={handleTruncate}
            isLoading={truncate.isLoading}
          >
            모두삭제
          </Button>
        </ButtonGroup>

        <Table>
          <Thead>
            <Tr>
              <Th fontFamily="inherit">상품</Th>
              <Th fontFamily="inherit">가격</Th>
              <Th fontFamily="inherit">판매자</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {data.map((cartItem) => (
              <CartTableRow key={cartItem.id} cartItem={cartItem} />
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

interface CartTableItemProps {
  cartItem: CartItemRes[number];
}
export function CartTableRow({ cartItem }: CartTableItemProps): JSX.Element {
  const selectedItems = useCartStore((s) => s.selectedItems);
  const handleToggle = useCartStore((s) => s.handleToggle);

  // 카트 상품 삭제
  const deleteCartItem = useCartItemDeleteMutation();
  const handleCartItemDelete = (itemId: CartItemType['id']): void => {
    deleteCartItem.mutateAsync(itemId);
  };

  // 카트 상품 전체 금액
  const totalPrice = useMemo(() => {
    return cartItem.options.reduce((p, n) => p + Number(n.discountPrice) * n.quantity, 0);
  }, [cartItem.options]);

  return (
    <Tr>
      {/* 상품정보 */}
      <Td>
        <Flex gap={4} alignItems="center">
          <Checkbox
            size="lg"
            colorScheme="blue"
            isChecked={selectedItems.findIndex((x) => x.id === cartItem.id) > -1}
            onChange={(e) => handleToggle(cartItem)}
          />
          <Image w="80px" rounded="md" src={cartItem.goods.image[0].image} alt="" />
          <Box w="100%">
            {/* // TODO: 상품상세페이지 작업 이후 해당 상품상세페이지로 이동하도록 변경  */}
            <NextLink href="/shopping">
              <Link fontSize="lg" fontWeight="bold" noOfLines={2}>
                {cartItem.goods.goods_name}
              </Link>
            </NextLink>

            <Flex mt={2} gap={1} flexDir="column">
              {cartItem.options.map((opt, idx) => (
                <CartTableRowOption key={opt.id} index={idx} option={opt} />
              ))}

              {cartItem.support && cartItem.support.broadcaster && (
                <Flex alignItems="center" gap={1} color="GrayText">
                  <Badge>후원방송인</Badge>
                  <BorderedAvatar
                    src={cartItem.support.broadcaster.avatar || undefined}
                    size="sm"
                  />
                  <Text fontSize="sm">{cartItem.support.broadcaster.userNickname}</Text>
                </Flex>
              )}
            </Flex>
          </Box>
        </Flex>
      </Td>

      <Td w="150px">
        <Text fontSize="xl">
          {getLocaleNumber(totalPrice)}{' '}
          <Text as="span" fontSize="md">
            원
          </Text>
        </Text>
        {cartItem.options.map((opt, idx) => (
          <Flex key={opt.id} gap={2} mt={1}>
            <Badge minW={9}>옵션{idx + 1}</Badge>
            <Text color="GrayText" fontSize="xs">
              {getLocaleNumber(opt.discountPrice)} 원
            </Text>
          </Flex>
        ))}
      </Td>

      <Td w="160px" textAlign="center">
        <Text>{cartItem.goods.seller.sellerShop.shopName}</Text>
        {!cartItem.shippingCostIncluded && (
          <Text>배송비 {getLocaleNumber(cartItem.shippingCost)} 원</Text>
        )}
      </Td>

      <Td>
        <Box>
          <IconButton
            size="sm"
            aria-label="delete-cart-item"
            onClick={() => handleCartItemDelete(cartItem.id)}
            isLoading={deleteCartItem.isLoading}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Td>
    </Tr>
  );
}
interface CartTableRowOptionProps {
  option: CartItemOption;
  index: number;
}
export function CartTableRowOption({
  option,
  index,
}: CartTableRowOptionProps): JSX.Element {
  const toast = useToast();

  // 카트 옵션 개수 추가 제거
  const optionQuantity = useCartOptionQuantity();
  const handleQuantityIncrease = async (): Promise<void> => {
    optionQuantity.mutateAsync({ optionId: option.id, quantity: option.quantity + 1 });
  };
  const handleQuantityDecrease = async (): Promise<void> => {
    if (option.quantity > 1) {
      optionQuantity.mutateAsync({ optionId: option.id, quantity: option.quantity - 1 });
    } else {
      toast({ status: 'error', title: '최소 1개 이상 주문할 수 있습니다.' });
    }
  };

  // 카트 상품 특정 옵션 삭제
  const deleteCartItemOpt = useCartItemOptDeleteMutation();
  const handleOptionDelete = (optId: CartItemOptionType['id']): void => {
    deleteCartItemOpt.mutateAsync(optId);
  };

  return (
    <Flex key={option.id} justifyContent="space-between">
      <Flex gap={1} alignItems="flex-start">
        <Badge>옵션{index + 1}</Badge>
        <Text fontSize="sm" color="GrayText">
          {option.name}: {option.value}
        </Text>
      </Flex>

      <Flex gap={1}>
        <IconButton
          aria-label="decrease-cart-item-option-quantity"
          icon={<MinusIcon />}
          size="xs"
          m={0}
          onClick={handleQuantityDecrease}
          isDisabled={option.quantity <= 1 || optionQuantity.isLoading}
        />
        <Text fontSize="lg" w={6} textAlign="center">
          {option.quantity}
        </Text>
        <IconButton
          aria-label="increase-cart-item-option-quantity"
          icon={<AddIcon />}
          size="xs"
          m={0}
          isDisabled={optionQuantity.isLoading}
          onClick={handleQuantityIncrease}
        />
        <IconButton
          ml={4}
          aria-label="delete-cartitem"
          size="xs"
          onClick={() => handleOptionDelete(option.id)}
          isLoading={deleteCartItemOpt.isLoading}
        >
          <DeleteIcon />
        </IconButton>
      </Flex>
    </Flex>
  );
}
export default CartTable;
