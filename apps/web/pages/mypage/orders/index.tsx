import { MypageLayout } from '@project-lc/components-shared/MypageLayout';
import { OrderFilterConsole } from '@project-lc/components/OrderFilterConsole';
import dynamic from 'next/dynamic';

const OrderList = dynamic(() => import('@project-lc/components/OrderList'));

export function Index(): JSX.Element {
  return (
    <MypageLayout>
      <OrderFilterConsole />
      <OrderList />
    </MypageLayout>
  );
}

export default Index;
