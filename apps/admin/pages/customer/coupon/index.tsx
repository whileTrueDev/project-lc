import { Box } from '@chakra-ui/react';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { AdminCreateCoupon } from '@project-lc/components-admin/AdminCreateCoupon';

export function Coupon(): JSX.Element {
  return (
    <AdminPageLayout>
      <Box>
        <AdminCreateCoupon />
      </Box>
    </AdminPageLayout>
  );
}

export default Coupon;
