import { CheckIcon, CloseIcon, DeleteIcon, Icon } from '@chakra-ui/icons';
import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  Divider,
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
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { MdOutlineShoppingCart } from 'react-icons/md';
import shallow from 'zustand/shallow';
import OptionQuantity from '../OptionQuantity';

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
    await truncate.mutateAsync(undefined);
  };

  // 최초 렌더링 체크
  const initialRenderRef = useRef<boolean>(true);
  // 렌더링시 장바구니 상품 모두 선택
  useEffect(() => {
    if (data && initialRenderRef.current) {
      handleSelectAll(data);
      initialRenderRef.current = false;
    }
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
      <Center>
        <Box my={12} textAlign="center">
          <Icon as={MdOutlineShoppingCart} width={40} height={40} color="GrayText" />
          <Text fontSize={{ base: 'md', lg: 'lg' }} whiteSpace="break-spaces">
            {`아직 장바구니에 담은 상품이 없습니다.\n상품을 추가해보세요.`}
          </Text>
        </Box>
      </Center>
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

        {/* PC화면 */}
        <Table display={{ base: 'none', md: 'block' }}>
          <Thead>
            <Tr>
              <Th fontFamily="inherit">상품</Th>
              <Th fontFamily="inherit">가격</Th>
              <Th fontFamily="inherit">배송비</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {data.map((cartItem) => (
              <CartTableRow key={cartItem.id} cartItem={cartItem} />
            ))}
          </Tbody>
        </Table>

        {/* 모바일 화면 */}
        <Box display={{ base: 'block', md: 'none' }}>
          {data.map((cartItem) => (
            <CartItemListItem key={cartItem.id} cartItem={cartItem} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

type CartTableItemProps = CartItemDisplayProps;
export function CartTableRow({ cartItem }: CartTableItemProps): JSX.Element {
  // 카트 상품 삭제
  const deleteCartItem = useCartItemDeleteMutation();
  const handleCartItemDelete = (itemId: CartItemType['id']): void => {
    deleteCartItem.mutateAsync(itemId);
  };

  return (
    <Tr>
      {/* 상품정보 */}
      <Td w="58%">
        <CartItemDisplay cartItem={cartItem} />
      </Td>

      <Td w="200px">
        <CartItemPriceDisplay cartItem={cartItem} />
      </Td>

      <Td w="200px" textAlign="center">
        <CartItemSellerInfoDisplay cartItem={cartItem} />
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

type CartItemListItemProps = CartItemDisplayProps;
export function CartItemListItem({ cartItem }: CartItemListItemProps): JSX.Element {
  // 카트 상품 삭제
  const deleteCartItem = useCartItemDeleteMutation();
  const handleCartItemDelete = (itemId: CartItemType['id']): void => {
    deleteCartItem.mutateAsync(itemId);
  };
  return (
    <Box mt={4}>
      <Box py={2}>
        <CartItemDisplay
          cartItem={cartItem}
          displayPrice
          displaySellerInfo
          onClose={() => handleCartItemDelete(cartItem.id)}
        />
      </Box>
      <Divider />
    </Box>
  );
}

export interface CartItemDisplayProps {
  cartItem: CartItemRes[number];
  displayPrice?: boolean;
  displaySellerInfo?: boolean;
  onClose?: () => void;
}
export function CartItemDisplay({
  cartItem,
  displayPrice = false,
  displaySellerInfo = false,
  onClose,
}: CartTableItemProps): JSX.Element {
  const selectedItems = useCartStore((s) => s.selectedItems);
  const handleToggle = useCartStore((s) => s.handleToggle);

  const checkbox = useMemo(
    () => (
      <Checkbox
        size="lg"
        colorScheme="blue"
        isChecked={selectedItems.findIndex((x) => x.id === cartItem.id) > -1}
        onChange={() => handleToggle(cartItem)}
      />
    ),
    [cartItem, handleToggle, selectedItems],
  );

  return (
    <>
      <Flex display={{ base: 'flex', lg: 'none' }} justify="space-between">
        {checkbox}
        {onClose && (
          <IconButton size="sm" aria-label="remove-this-cartitem" onClick={onClose}>
            <DeleteIcon />
          </IconButton>
        )}
      </Flex>
      <Flex gap={4} alignItems={{ base: 'flex-start', lg: 'center' }}>
        <Box display={{ base: 'none', lg: 'block' }}>{checkbox}</Box>
        <Image w="80px" rounded="md" src={cartItem.goods.image[0].image} alt="" />
        <Box w="100%">
          <Text fontSize="xs">{cartItem.goods.seller.sellerShop.shopName}</Text>
          <NextLink href={`/goods/${cartItem.goods.id}`}>
            <Link
              fontSize={{ base: 'sm', sm: 'md', lg: 'lg' }}
              fontWeight="bold"
              noOfLines={2}
            >
              {cartItem.goods.goods_name}
            </Link>
          </NextLink>

          <Flex mt={2} gap={2} flexDir="column">
            {cartItem.options.map((opt, idx) => (
              <CartTableRowOption key={opt.id} index={idx} option={opt} />
            ))}

            {cartItem.support && cartItem.support.broadcaster && (
              <Flex alignItems="center" gap={1} color="GrayText">
                <Badge>후원방송인</Badge>
                <Avatar
                  src={cartItem.support.broadcaster.avatar || undefined}
                  size="sm"
                />
                <Text fontSize="sm" noOfLines={1}>
                  {cartItem.support.broadcaster.userNickname}
                </Text>
              </Flex>
            )}
          </Flex>

          {displayPrice && <CartItemPriceDisplay cartItem={cartItem} />}
          {displaySellerInfo && <CartItemSellerInfoDisplay cartItem={cartItem} />}
        </Box>
      </Flex>
    </>
  );
}

export function CartItemPriceDisplay({ cartItem }: CartTableItemProps): JSX.Element {
  // 카트 상품 전체 금액
  const totalPrice = useMemo(() => {
    return cartItem.options.reduce((p, n) => p + Number(n.discountPrice) * n.quantity, 0);
  }, [cartItem.options]);

  return (
    <Box>
      <Text fontSize="xl">
        <Text as="span" fontWeight="bold">
          {getLocaleNumber(totalPrice)}{' '}
        </Text>
        <Text as="span" fontSize="sm">
          원
        </Text>
      </Text>
      {cartItem.options.map((opt, idx) => (
        <Flex key={opt.id} gap={2} mt={1}>
          <Text color="GrayText" fontSize="xs">
            옵션{idx + 1} {getLocaleNumber(Number(opt.discountPrice) * opt.quantity)} 원
          </Text>
        </Flex>
      ))}
    </Box>
  );
}

export function CartItemSellerInfoDisplay({ cartItem }: CartTableItemProps): JSX.Element {
  return (
    <Box color="GrayText" my={1}>
      <Text fontSize={{ base: 'xs', md: 'sm' }}>
        배송비{' '}
        {!cartItem.shippingCostIncluded ? getLocaleNumber(cartItem.shippingCost) : 0} 원
      </Text>
    </Box>
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
  // 옵션 개수 높이기
  const handleQuantityIncrease = useCallback(async (): Promise<void> => {
    optionQuantity.mutateAsync({ optionId: option.id, quantity: option.quantity + 1 });
  }, [option.id, option.quantity, optionQuantity]);
  // 옵션 개수 낮추기
  const handleQuantityDecrease = useCallback(async (): Promise<void> => {
    if (option.quantity > 1) {
      optionQuantity.mutateAsync({ optionId: option.id, quantity: option.quantity - 1 });
    } else {
      toast({ status: 'error', title: '최소 1개 이상 주문할 수 있습니다.' });
    }
  }, [option.id, option.quantity, optionQuantity, toast]);

  // 카트 상품 특정 옵션 삭제
  const deleteCartItemOpt = useCartItemOptDeleteMutation();
  const handleOptionDelete = useCallback(
    (optId: CartItemOptionType['id']): void => {
      deleteCartItemOpt.mutateAsync(optId);
    },
    [deleteCartItemOpt],
  );

  const optionButtons = useMemo(
    () => (
      <Flex gap={1}>
        <OptionQuantity
          quantity={option.quantity}
          handleDecrease={handleQuantityDecrease}
          handleIncrease={handleQuantityIncrease}
          decreaseDisabled={option.quantity <= 1 || optionQuantity.isLoading}
          increaseDisabled={optionQuantity.isLoading}
        />

        <IconButton
          variant="outline"
          ml={4}
          aria-label="delete-cartitem"
          size="xs"
          onClick={() => handleOptionDelete(option.id)}
          isLoading={deleteCartItemOpt.isLoading}
          icon={<DeleteIcon />}
        />
      </Flex>
    ),
    [
      deleteCartItemOpt.isLoading,
      handleOptionDelete,
      handleQuantityDecrease,
      handleQuantityIncrease,
      option.id,
      option.quantity,
      optionQuantity.isLoading,
    ],
  );

  return (
    <Flex key={option.id} justifyContent="space-between" flexDir="column">
      <Flex gap={1} alignItems="flex-start" flexDir={{ base: 'column', lg: 'column' }}>
        <Flex gap={1} alignItems="center">
          <Badge>옵션{index + 1}</Badge>
          <Text fontSize={{ base: 'xs', lg: 'sm' }} color="GrayText" noOfLines={1}>
            {option.name}: {option.value}
          </Text>
        </Flex>
        {optionButtons}
      </Flex>
    </Flex>
  );
}
export default CartTable;
