import { Button, Stack } from '@chakra-ui/react';
import { useCart } from '@project-lc/hooks';
import { useCartStore } from '@project-lc/stores';
import { useRouter } from 'next/router';

export function CartActions(): JSX.Element {
  const router = useRouter();
  const { selectedItems } = useCartStore();
  const { data } = useCart();

  return (
    <Stack>
      <Button
        size="lg"
        isFullWidth
        colorScheme="blue"
        onClick={() => {
          // TODO: 주문 페이지 구성 이후 추가 작업 필요
          alert('주문 페이지 이동 + 카트상품을 주문 상품으로 지정');
          console.log('[선택상품 주문하기] selectedItems: ', selectedItems);
        }}
        isDisabled={!data || !!(data.length === 0) || selectedItems.length <= 0}
      >
        선택상품 주문하기
      </Button>
      <Button
        size="lg"
        isFullWidth
        variant="outline"
        onClick={() => router.push('/shopping')}
      >
        계속 쇼핑하기
      </Button>
    </Stack>
  );
}

export default CartActions;
