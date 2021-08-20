import { OrderFilterConsole, MypageLayout, OrderList } from '@project-lc/components';
import { FmOrder } from '@project-lc/shared-types';
import { getFmOrders, useFmOrders } from '@project-lc/hooks';

import { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next';

interface IndexProps {
  initialOrders: FmOrder[];
}

export const getStaticProps: GetStaticProps<IndexProps> = async (
  context: GetStaticPropsContext,
) => {
  const orders = await getFmOrders();
  return {
    props: {
      initialOrders: orders,
    },
  };
};

export function Index({
  initialOrders,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const orders = useFmOrders(initialOrders);
  return (
    <MypageLayout>
      <OrderFilterConsole />
      <OrderList orders={orders.data} />
    </MypageLayout>
  );
}

export default Index;
