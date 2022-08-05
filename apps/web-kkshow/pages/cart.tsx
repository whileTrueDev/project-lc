import { Box } from '@chakra-ui/react';
import { CartActions } from '@project-lc/components-web-kkshow/cart/CartActions';
import { CartLayout } from '@project-lc/components-web-kkshow/cart/CartLayout';
import { CartSummary } from '@project-lc/components-web-kkshow/cart/CartSummary';
import { CartTable } from '@project-lc/components-web-kkshow/cart/CartTable';
import KkshowLayout from '@project-lc/components-web-kkshow/KkshowLayout';

export function Cart(): JSX.Element {
  return (
    <Box position="relative">
      <KkshowLayout navbarFirstLink="kkmarket">
        <Box minH="65vh">
          <CartLayout>
            <CartTable />
            <CartSummary />
            <CartActions />
          </CartLayout>
        </Box>
      </KkshowLayout>
    </Box>
  );
}

export default Cart;
