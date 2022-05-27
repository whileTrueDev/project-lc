import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { AdminCreateCouponDialog } from './AdminCreateCouponDialog';

export function AdminCreateCoupon(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Button onClick={onOpen}>+ 쿠폰생성</Button>
      <AdminCreateCouponDialog isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
