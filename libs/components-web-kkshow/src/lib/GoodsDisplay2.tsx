import { Avatar, Badge, Box, Flex, Image, Text } from '@chakra-ui/react';
import {
  Goods,
  GoodsImages,
  GoodsOptions,
  OrderProcessStep,
  Seller,
  SellerShop,
} from '@prisma/client';
import { OrderStatusBadge } from './mypage/orderList/CustomerOrderItem';

export interface GoodsDisplay2Props {
  goods: {
    imageSrc: GoodsImages['image'];
    name: Goods['goods_name'];
    options?: {
      id: GoodsOptions['id'];
      name: string | null;
      value: string | null;
      quantity: number;
      step: OrderProcessStep;
    }[];
    seller?: {
      id: Seller['id'];
      avatar?: Seller['avatar'] | null;
      sellerShop?: {
        shopName: SellerShop['shopName'];
      };
    };
  };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
export function GoodsDisplay2({ goods, size = 'md' }: GoodsDisplay2Props): JSX.Element {
  let imageSize = 100;
  switch (size) {
    case 'xs':
      imageSize = 50;
      break;
    case 'sm':
      imageSize = 75;
      break;
    case 'md':
      imageSize = 100;
      break;
    case 'lg':
      imageSize = 125;
      break;
    case 'xl':
      imageSize = 150;
      break;
    default:
      imageSize = 100;
      break;
  }
  return (
    <Flex gap={2}>
      <Image
        rounded="md"
        src={goods.imageSrc}
        width={imageSize}
        height={imageSize}
        objectFit="cover"
        draggable={false}
      />
      <Box>
        <Text fontWeight="bold">{goods.name}</Text>
        {goods.options &&
          goods.options.map((opt) => (
            <Flex key={opt.id} align="center" gap={1}>
              <Badge variant="solid">{opt.name}</Badge>
              <Text fontSize="sm">
                {opt.value}, {opt.quantity} 개
              </Text>
              <OrderStatusBadge step={opt.step} />
            </Flex>
          ))}

        {goods.seller && (
          <Flex gap={1} alignItems="center">
            {goods.seller.avatar && <Avatar src={goods.seller.avatar} size="xs" />}
            <Text fontSize="sm">{goods.seller.sellerShop?.shopName}</Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

export default GoodsDisplay2;
