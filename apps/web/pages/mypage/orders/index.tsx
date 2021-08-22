import { MypageLayout, OrderFilterConsole, OrderList } from '@project-lc/components';

export function Index(): JSX.Element {
  return (
    <MypageLayout>
      <OrderFilterConsole />
      <OrderList />
    </MypageLayout>
  );
}

export default Index;
