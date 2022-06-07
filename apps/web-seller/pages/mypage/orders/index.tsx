import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { OrderFilterConsole } from '@project-lc/components-seller/kkshow-order/OrderFilterConsole';
import dynamic from 'next/dynamic';

const OrderList = dynamic(
  () => import('@project-lc/components-seller/kkshow-order/OrderList'),
);

export function Index(): JSX.Element {
  return (
    <MypageLayout>
      <OrderFilterConsole />
      <OrderList />
    </MypageLayout>
  );
}

export default Index;
