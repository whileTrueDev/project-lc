import { Box } from '@chakra-ui/react';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { AdminCreateCoupon } from '@project-lc/components-admin/AdminCreateCoupon';
import { AdminCouponList } from '@project-lc/components-admin/AdminCouponList';

export function Coupon(): JSX.Element {
  return (
    <AdminPageLayout>
      <Box>
        <AdminCreateCoupon />
        <AdminCouponList />
      </Box>
    </AdminPageLayout>
  );
}

export default Coupon;
