import { Box, Heading } from '@chakra-ui/react';

interface CartLayoutProps {
  children: React.ReactNode;
  title?: string;
}
export function CartLayout({
  children,
  title = '장바구니',
}: CartLayoutProps): JSX.Element {
  return (
    <Box maxW="5xl" mx="auto" my={{ base: 2, lg: 16 }} px={2}>
      <Heading display={{ base: 'none', lg: 'block' }} fontSize="3xl">
        {title}
      </Heading>
      {children}
    </Box>
  );
}

export default CartLayout;
