import { Button } from '@chakra-ui/button';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useQueryClient } from 'react-query';

const adminPagePathNeedAlarmResetButton = [
  '/broadcaster/settlement-info',
  '/broadcaster/settlement',
  '/seller/account',
  '/seller/business-registration',
  '/seller/settlement',
  '/goods/confirmation',
  '/goods/inquiry',
  '/live-shopping',
  '/order/order-cancel',
  '/order/list',
  '/order/refund',
  '/general/inquiry',
];

const queryKeyByPath: Record<string, string> = {
  '/broadcaster/settlement-info': '',
  '/broadcaster/settlement': '',
  '/seller/account': '',
  '/seller/business-registration': '',
  '/seller/settlement': 'SellerSettlementTargets',
  '/goods/confirmation': '',
  '/goods/inquiry': '',
  '/live-shopping': '',
  '/order/order-cancel': '',
  '/order/list': '',
  '/order/refund': '',
  '/general/inquiry': '',
};

export function AdminTabAlarmResetButton(): JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const onClick = (): void => {
    console.log(router.pathname);
    console.log(queryClient.getQueryData(queryKeyByPath[router.pathname]));
  };
  const isAlarmResetButtonNeeded = useMemo(() => {
    return adminPagePathNeedAlarmResetButton.includes(router.pathname);
  }, [router.pathname]);

  if (isAlarmResetButtonNeeded) {
    return (
      <Button colorScheme="red" onClick={onClick}>
        알림 초기화
      </Button>
    );
  }
  return <></>;
}

export default AdminTabAlarmResetButton;
