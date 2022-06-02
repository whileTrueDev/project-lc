import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { AdminCreateCouponDialog } from './AdminCreateCouponDialog';

export function AdminCreateCoupon(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box mb={2}>
      <Button onClick={onOpen} colorScheme="blue">
        + 쿠폰생성
      </Button>
      <AdminCreateCouponDialog isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
