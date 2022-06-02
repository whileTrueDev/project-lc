import { Box, Button } from '@chakra-ui/react';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { AdminCreateCoupon } from '@project-lc/components-admin/AdminCreateCoupon';
import { AdminCouponList } from '@project-lc/components-admin/AdminCouponList';
import { useRouter } from 'next/router';

export function Coupon(): JSX.Element {
  const router = useRouter();
  return (
    <AdminPageLayout>
      <Box>
        <AdminCreateCoupon />
        <AdminCouponList />
        <Button
          onClick={() => {
            router.push('coupon/history');
          }}
        >
          쿠폰로그 보기
        </Button>
      </Box>
    </AdminPageLayout>
  );
}

export default Coupon;
