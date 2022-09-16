import { CheckCircleIcon, DeleteIcon } from '@chakra-ui/icons';
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
  Image,
  Link,
  Spinner,
  Stack,
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
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import CustomAvatar from '@project-lc/components-core/CustomAvatar';
import {
  useCart,
  useCartItemDeleteMutation,
  useCartItemOptDeleteMutation,
  useCartOptionQuantity,
  useCartShippingGroups,
  useCartTruncateMutation,
  useIsThisGoodsNowOnLive,
  useLiveShoppingSpecialPriceListNowOnLiveByBroadcaster,
  useProductPromotions,
  useResizedImage,
} from '@project-lc/hooks';
import { CartItemRes } from '@project-lc/shared-types';
import { useCartStore } from '@project-lc/stores';
import { getCartKey, getLocaleNumber } from '@project-lc/utils-frontend';
import NextLink from 'next/link';
import { useCallback, useEffect, useMemo, useRef } from 'react';
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

  // 배송비정책별 장바구니 상품, 배송비정책 별 배송비, 배송비정책 id 목록
  const {
    cartItemsObjectGroupedById,
    totalShippingCostObjectById,
    shippingGroupIdList,
    shippingGroupWithShopNameObject,
  } = useCartShippingGroups();

  if (isLoading)
    return (
      <Center my={12}>
        <Spinner />
      </Center>
    );
  if (!isLoading && (!data || (data && data.length === 0)))
    return (
      <Center>
        <Box my={24} textAlign="center">
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
        <ButtonGroup size="sm" display="flex" justifyContent="space-between">
          <Button
            variant="outline"
            leftIcon={
              <CheckCircleIcon
                color={selectedItems.length === data.length ? 'blue' : 'gray'}
              />
            }
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
            장바구니 모두 비우기
          </Button>
        </ButtonGroup>

        {/* PC화면 */}
        <Table display={{ base: 'none', md: 'block' }} mt={2}>
          <Thead>
            <Tr>
              <Th fontFamily="inherit">상품</Th>
              <Th fontFamily="inherit">가격</Th>
              <Th />
              <Th fontFamily="inherit">배송비</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* 동일한 배송비 그룹별로 장바구니 상품 묶어서 표시 */}
            {shippingGroupIdList.map((shippingGroupId) => {
              return cartItemsObjectGroupedById[shippingGroupId].map(
                (cartItemId, index) => {
                  const item = data.find((d) => d.id === cartItemId);
                  if (!item) return null;
                  const shippingCostObj = totalShippingCostObjectById[shippingGroupId];
                  const shippingCost = shippingCostObj
                    ? shippingCostObj.std + shippingCostObj.add
                    : null;
                  return (
                    <CartTableRow
                      key={cartItemId}
                      cartItem={item}
                      rowSpan={cartItemsObjectGroupedById[shippingGroupId].length} // 동일배송그룹에 속하는 장바구니상품 개수만큼 rowSpan
                      hideShippingCost={index !== 0} // 첫번째 카트상품만 배송비 td 표시
                      shippingCost={shippingCost}
                      shopName={shippingGroupWithShopNameObject[shippingGroupId].shopName}
                    />
                  );
                },
              );
            })}
          </Tbody>
        </Table>

        {/* 모바일 화면 */}
        <Stack display={{ base: 'block', md: 'none' }}>
          {/* 동일한 배송비 그룹별로 장바구니 상품 묶어서 표시 */}
          {shippingGroupIdList.map((shippingGroupId) => {
            const shopName =
              shippingGroupWithShopNameObject[shippingGroupId].shopName || '';
            const shippingCostObj = totalShippingCostObjectById[shippingGroupId];
            const shippingCost = shippingCostObj
              ? shippingCostObj.std + shippingCostObj.add
              : null;
            return (
              <Box key={shippingGroupId} {...boxStyle} mt={2}>
                <Box>
                  {cartItemsObjectGroupedById[shippingGroupId].map((cartItemId) => {
                    const cartItem = data.find((d) => d.id === cartItemId);
                    if (!cartItem) return null;
                    return <CartItemListItem key={cartItem.id} cartItem={cartItem} />;
                  })}
                </Box>
                <Stack direction="row" fontSize={{ base: 'xs', md: 'sm' }} my={1}>
                  <CartItemShopNameAndShippingCost
                    shippingCost={shippingCost}
                    shopName={shopName}
                  />
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}

type CartTableItemProps = CartItemDisplayProps & {
  rowSpan?: number;
  hideShippingCost?: boolean;
  shippingCost?: number | null;
  shopName?: string;
};
export function CartTableRow({
  cartItem,
  rowSpan,
  hideShippingCost = false,
  shippingCost,
  shopName,
}: CartTableItemProps): JSX.Element {
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

      {/* 상품가격 */}
      <Td w="200px">
        <CartItemPriceDisplay cartItem={cartItem} />
      </Td>

      <Td>
        <Box>
          <Button
            size="sm"
            aria-label="delete-cart-item"
            onClick={() => handleCartItemDelete(cartItem.id)}
            isLoading={deleteCartItem.isLoading}
            leftIcon={<DeleteIcon />}
          >
            상품삭제
          </Button>
        </Box>
      </Td>

      {/* 배송비 */}
      {!hideShippingCost && (
        <Td
          w="200px"
          textAlign="center"
          rowSpan={rowSpan}
          fontSize={{ base: 'xs', md: 'sm' }}
        >
          <CartItemShopNameAndShippingCost
            shippingCost={shippingCost}
            shopName={shopName || ''}
          />
        </Td>
      )}
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
  // displaySellerInfo?: boolean;
  onClose?: () => void;
}
export function CartItemDisplay({
  cartItem,
  displayPrice = false,
  // displaySellerInfo = false,
  onClose,
}: CartTableItemProps): JSX.Element {
  const selectedItems = useCartStore((s) => s.selectedItems);
  const handleToggle = useCartStore((s) => s.handleToggle);

  const checkbox = useMemo(
    () => (
      <Checkbox
        size="lg"
        colorScheme="blue"
        isChecked={selectedItems.findIndex((goodsId) => goodsId === cartItem.id) > -1}
        onChange={() => handleToggle(cartItem)}
      />
    ),
    [cartItem, handleToggle, selectedItems],
  );

  // 현재 상품이 라이브쇼핑 판매중인지 여부 (선택된 방송인에 의한 라이브쇼핑판매)
  const isNowLive = useIsThisGoodsNowOnLive(
    cartItem.goods.id,
    cartItem.support?.broadcasterId || undefined,
  );
  // 각 상품의 상품홍보 정보
  const pp = useProductPromotions({ goodsIds: [cartItem.goods.id] });
  const nowAvailablePp = useMemo(
    () => pp.data?.some((p) => p.broadcasterId === cartItem.support?.broadcasterId),
    [cartItem.support?.broadcasterId, pp.data],
  );

  return (
    <>
      <Flex display={{ base: 'flex', lg: 'none' }} justify="space-between">
        {checkbox}
        {onClose && (
          <Button
            size="sm"
            aria-label="remove-this-cartitem"
            onClick={onClose}
            leftIcon={<DeleteIcon />}
          >
            상품삭제
          </Button>
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

            {nowAvailablePp && cartItem.support && cartItem.support.broadcaster && (
              <Flex alignItems="center" gap={1} color="GrayText">
                <Badge>후원방송인</Badge>
                <CustomAvatar
                  src={cartItem?.support?.broadcaster.avatar || ''}
                  size="sm"
                />
                <Text fontSize="sm" noOfLines={1}>
                  {cartItem.support.broadcaster.userNickname}
                </Text>
                {isNowLive && (
                  <Badge variant="solid" colorScheme="red">
                    현재 LIVE 판매중
                  </Badge>
                )}
              </Flex>
            )}
          </Flex>

          {displayPrice && <CartItemPriceDisplay cartItem={cartItem} />}
        </Box>
      </Flex>
    </>
  );
}

export function CartItemPriceDisplay({ cartItem }: CartTableItemProps): JSX.Element {
  // 현재 진행중인 라이브인지 확인
  const isNowLive = useIsThisGoodsNowOnLive(
    cartItem.goods.id,
    cartItem.support?.broadcasterId || undefined,
  );

  // 현재 진행중인 라이브쇼핑의 특가정보
  const specialPriceItemList = useLiveShoppingSpecialPriceListNowOnLiveByBroadcaster(
    cartItem.goods.id,
    cartItem.support?.broadcasterId || undefined,
  );

  // 카트상품옵션 정보에 라이브특가 데이터 추가하기
  const cartItemOptionsWithSpecialPrice: (CartItemOption & { specialPrice?: number })[] =
    useMemo(() => {
      if (!isNowLive || !specialPriceItemList) return cartItem.options;
      return cartItem.options.map((cio) => {
        const lsSpecialPrice = specialPriceItemList.find(
          (sp) => sp.goodsOptionId === cio.goodsOptionsId,
        );
        return { ...cio, specialPrice: Number(lsSpecialPrice?.specialPrice) };
      });
    }, [cartItem.options, isNowLive, specialPriceItemList]);

  // 카트 상품 전체 금액
  const totalPrice = useMemo(() => {
    return cartItemOptionsWithSpecialPrice.reduce((p, n) => {
      let price = Number(n.discountPrice);
      if (n.specialPrice) {
        price = n.specialPrice;
      }
      return p + price * n.quantity;
    }, 0);
  }, [cartItemOptionsWithSpecialPrice]);
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
      {cartItemOptionsWithSpecialPrice.map((opt, idx) => (
        <Flex key={opt.id} gap={2} mt={1}>
          <Text color="GrayText" fontSize="xs">
            옵션{idx + 1}{' '}
            {opt.specialPrice
              ? getLocaleNumber(opt.specialPrice * opt.quantity)
              : getLocaleNumber(Number(opt.discountPrice) * opt.quantity)}{' '}
            원
          </Text>
        </Flex>
      ))}
    </Box>
  );
}

export function CartItemShopNameAndShippingCost({
  shopName,
  shippingCost,
}: {
  shopName: string;
  shippingCost?: number | null;
}): JSX.Element {
  return (
    <>
      <Text>{shopName}</Text>
      {shippingCost !== null ? (
        <Stack direction={{ base: 'row', sm: 'column' }} color="GrayText" my={1}>
          <Text>배송비</Text>
          <Text>{getLocaleNumber(shippingCost)} 원</Text>
        </Stack>
      ) : (
        <Text>-</Text>
      )}
    </>
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

        <Button
          variant="outline"
          ml={4}
          aria-label="delete-cartitem"
          size="xs"
          onClick={() => handleOptionDelete(option.id)}
          isLoading={deleteCartItemOpt.isLoading}
          leftIcon={<DeleteIcon />}
        >
          옵션삭제
        </Button>
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
