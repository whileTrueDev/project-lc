import { MypageLayout, OrderFilterConsole } from '@project-lc/components';
import dynamic from 'next/dynamic';
// import { OrderList } from '@project-lc/components-orderList';

const OrderList = dynamic(() =>
  import('@project-lc/components-orderList').then((mod) => mod.OrderList),
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
