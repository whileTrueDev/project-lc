import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { GoodsReview } from '@prisma/client';
import CustomAvatar from '@project-lc/components-core/CustomAvatar';
import TextDotConnector from '@project-lc/components-core/TextDotConnector';
import ReviewCreateDialog, {
  ReviewCreateDialogProps,
} from '@project-lc/components-shared/goods-review/ReviewCreateDialog';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import { OrderItemWithRelations, reviewAbleSteps } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';

interface OrderInfoItemsListProps {
  orderItems: OrderItemWithRelations[];
}
export function OrderInfoItemsList({ orderItems }: OrderInfoItemsListProps): JSX.Element {
  return (
    <Box>
      {orderItems.map((oi) => (
        <OrderInfoItem key={oi.id} orderItem={oi} />
      ))}
    </Box>
  );
}
interface OrderInfoItemProps {
  orderItem: OrderItemWithRelations;
}
export function OrderInfoItem({ orderItem }: OrderInfoItemProps): JSX.Element | null {
  if (!orderItem.goodsId) return null;
  return (
    <Stack key={orderItem.id} borderWidth="thin" p={2} rounded="md" my={2}>
      <OrderInfoItemReview
        isReviewable={orderItem.options.every((x) => reviewAbleSteps.includes(x.step))}
        review={orderItem.review || undefined}
        goodsId={orderItem.goodsId}
        orderItemId={orderItem.id}
      />

      <OrderInfoGoodsOptions
        goods={orderItem.goods}
        orderItemOptions={orderItem.options}
      />

      <OrderInfoGoodsSupport support={orderItem.support} />
    </Stack>
  );
}

interface OrderInfoItemReviewProps
  extends Pick<ReviewCreateDialogProps, 'goodsId' | 'orderItemId'> {
  review?: GoodsReview;
  isReviewable?: boolean;
}
export function OrderInfoItemReview({
  review,
  isReviewable = false,
  goodsId,
  orderItemId,
}: OrderInfoItemReviewProps): JSX.Element {
  const reviewCreateDialog = useDisclosure();
  return (
    <Box mb={2}>
      {review ? (
        <Box>
          <Text fontSize="sm" color="green">
            리뷰작성완료
          </Text>
        </Box>
      ) : (
        <Box>
          {isReviewable ? (
            <>
              <Button size="sm" onClick={reviewCreateDialog.onOpen}>
                리뷰작성하기
              </Button>
              <ReviewCreateDialog
                goodsId={goodsId}
                isOpen={reviewCreateDialog.isOpen}
                onClose={reviewCreateDialog.onClose}
                orderItemId={orderItemId}
              />
            </>
          ) : null}
        </Box>
      )}
    </Box>
  );
}

interface OrderInfoGoodsOptionsProps {
  goods: OrderItemWithRelations['goods'];
  orderItemOptions: OrderItemWithRelations['options'];
}
export function OrderInfoGoodsOptions({
  goods,
  orderItemOptions,
}: OrderInfoGoodsOptionsProps): JSX.Element {
  return (
    <Flex gap={2}>
      {goods.image.length > 0 && (
        <Image
          src={goods.image[0].image}
          width={50}
          height={50}
          objectFit="cover"
          draggable={false}
          rounded="md"
        />
      )}
      <Box>
        <Text fontSize="sm">{goods.seller.sellerShop.shopName}</Text>
        <Text>{goods.goods_name}</Text>

        {orderItemOptions.map((o) => (
          <HStack key={o.id} fontSize="sm">
            <OrderStatusBadge step={o.step} />
            <Text>
              {o.name}: {o.value} {o.quantity}개
            </Text>
            <TextDotConnector />
            <Text>{getLocaleNumber(o.discountPrice)}원</Text>
          </HStack>
        ))}
      </Box>
    </Flex>
  );
}

interface OrderInfoGoodsSupportProps {
  support: OrderItemWithRelations['support'];
}
export function OrderInfoGoodsSupport({
  support,
}: OrderInfoGoodsSupportProps): JSX.Element | null {
  if (!support) return null;
  return (
    <Box fontSize="sm" mt={4}>
      <Text fontWeight="bold">후원 정보</Text>
      <Box>
        <CustomAvatar src={support?.broadcaster?.avatar || ''} />
        <Text>{support.broadcaster.userNickname}</Text>
      </Box>
      <Text>후원 닉네임: {support.nickname}</Text>
      <Text>후원 메시지: {support.message}</Text>
    </Box>
  );
}
