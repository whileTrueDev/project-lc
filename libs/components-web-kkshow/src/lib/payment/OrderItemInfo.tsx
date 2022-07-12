/* eslint-disable react/no-array-index-key */
import { Box, Flex, Image, Spinner, Stack, Text } from '@chakra-ui/react';
import TextDotConnector from '@project-lc/components-core/TextDotConnector';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { useGoodsById } from '@project-lc/hooks';
import { CreateOrderForm } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { useFieldArray, useFormContext } from 'react-hook-form';
import OrderItemSupport from './OrderItemSupport';

export function OrderItemInfo(): JSX.Element {
  const { control, getValues } = useFormContext<CreateOrderForm>();
  const { fields: orderItems } = useFieldArray({ control, name: 'orderItems' });
  const isGiftOrder = getValues('giftFlag');

  return (
    <SectionWithTitle title="주문 상품">
      {orderItems.map((item, idx) => (
        <OrderItem
          orderItem={item}
          key={idx}
          index={idx}
          disableSupportInfo={!!isGiftOrder || !item.support}
        />
      ))}
    </SectionWithTitle>
  );
}

interface OrderItemProps {
  index: number;
  orderItem: {
    goodsId: number | null;
    options: Array<{
      goodsOptionId: number | null;
      name: string | null;
      value: string | null;
      quantity: number;
      normalPrice: number;
      discountPrice: number;
    }>;
    support?: {
      broadcasterId: number | null;
      message?: string | null;
      nickname?: string | null;
      avatar?: string | null;
    };
  };
  disableSupportInfo?: boolean;
}

export function OrderItem({
  orderItem,
  index,
  disableSupportInfo = false,
}: OrderItemProps): JSX.Element | null {
  const goods = useGoodsById(orderItem.goodsId);
  if (goods.isLoading) return <Spinner />;
  if (!goods.data) return null;
  return (
    <Stack p={2} borderWidth="thin" rounded="md" my={1}>
      <Flex gap={2}>
        <Image
          draggable={false}
          src={goods.data.image ? goods.data.image[0].image : ''}
          alt={goods.data.goods_name}
          w={{ base: 45, sm: 85 }}
          h={{ base: 45, sm: 85 }}
          rounded="md"
          objectFit="cover"
        />
        <Box>
          {goods.data.seller.sellerShop && (
            <Text fontSize={{ base: 'xs', sm: 'sm' }}>
              {goods.data.seller.sellerShop?.shopName}
            </Text>
          )}
          <Text fontSize={{ base: 'sm', sm: 'md' }}>{goods.data.goods_name}</Text>
          {orderItem.options.map((option) => (
            <Flex
              key={option.goodsOptionId}
              fontSize={{ base: 'xs', sm: 'sm' }}
              flexWrap="wrap"
              gap={{ base: 0.5, sm: 1 }}
            >
              <Text>
                {option.name} : {option.value}
              </Text>
              <TextDotConnector />
              <Text>{option.quantity} 개 </Text>
              <TextDotConnector />
              <Text>
                {getLocaleNumber(Number(option.discountPrice) * option.quantity)}원
              </Text>
            </Flex>
          ))}
          <Box fontSize="sm">
            {!disableSupportInfo && (
              <OrderItemSupport
                avatar={orderItem.support?.avatar}
                nickname={orderItem.support?.nickname}
                orderItemIndex={index}
                avatarSize="sm"
              />
            )}
          </Box>
        </Box>
      </Flex>
    </Stack>
  );
}
