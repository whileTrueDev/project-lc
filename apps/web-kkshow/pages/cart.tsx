import { Box } from '@chakra-ui/react';
import { CartActions } from '@project-lc/components-web-kkshow/cart/CartActions';
import { CartLayout } from '@project-lc/components-web-kkshow/cart/CartLayout';
import { CartSummary } from '@project-lc/components-web-kkshow/cart/CartSummary';
import { CartTable } from '@project-lc/components-web-kkshow/cart/CartTable';
import KkshowLayout from '@project-lc/components-web-kkshow/KkshowLayout';

export function Cart(): JSX.Element {
  return (
    <Box overflow="hidden" position="relative">
      <KkshowLayout>
        <CartLayout>
          <CartTable />
          <CartSummary />
          <CartActions />
        </CartLayout>
      </KkshowLayout>
    </Box>
  );
}

export default Cart;
