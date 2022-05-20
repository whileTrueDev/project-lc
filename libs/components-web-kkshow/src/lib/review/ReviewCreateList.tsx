import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useOrderItemReviewNeeded, useProfile } from '@project-lc/hooks';
import { OrderItemReviewNeeded } from '@project-lc/shared-types';
import GoodsDisplay2 from '../GoodsDisplay2';
import ReviewCreateDialog from './ReviewCreateDialog';

export function ReviewCreateList(): JSX.Element | null {
  const profile = useProfile();
  const orderItem = useOrderItemReviewNeeded(profile.data?.id);

  if (!orderItem.data) return null;
  if (orderItem.data.length <= 0)
    return (
      <Box>
        <Text>후기 작성 가능한 상품이 없습니다.</Text>
      </Box>
    );

  return (
    <Box>
      {orderItem.data?.map((item) => (
        <ReviewCreateOrderItem key={item.id} item={item} />
      ))}
    </Box>
  );
}

export default ReviewCreateList;

interface ReviewCreateOrderItemProps {
  item: OrderItemReviewNeeded;
}
function ReviewCreateOrderItem({ item }: ReviewCreateOrderItemProps): JSX.Element {
  const isFullWidth = useBreakpointValue({ base: true, sm: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Flex
        py={4}
        justify="space-between"
        align={{ base: 'unset', md: 'center' }}
        flexDir={{ base: 'column', sm: 'row' }}
        gap={{ base: 4, md: 2 }}
      >
        <GoodsDisplay2
          goods={{
            imageSrc: item.goods.image[0].image,
            name: item.goods.goods_name,
            options: item.options,
          }}
        />

        <Box>
          <Button
            variant="outline"
            colorScheme="blue"
            isFullWidth={isFullWidth}
            onClick={onOpen}
          >
            후기 작성하기
          </Button>
        </Box>
      </Flex>
      <Divider />

      <ReviewCreateDialog
        goodsId={item.goodsId}
        orderItemId={item.id}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
