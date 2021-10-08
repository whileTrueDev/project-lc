import { Button, Center, Spinner, Text } from '@chakra-ui/react';
import { useSellerShippingGroupList } from '@project-lc/hooks';
import SettingSectionLayout from './SettingSectionLayout';

export function ShopInfoShippingGroup(): JSX.Element {
  const { data, isLoading } = useSellerShippingGroupList();

  if (isLoading) {
    return (
      <SettingSectionLayout title="배송비 정책">
        <Center>
          <Spinner />
        </Center>
      </SettingSectionLayout>
    );
  }
  return (
    <SettingSectionLayout title="배송비 정책">
      <Button width="200px">배송비정책 생성하기</Button>
      {data &&
        data.map((g) => (
          <Text
            key={g.id}
          >{`${g.shipping_group_name}  ${g.shipping_calcul_type}  ${g._count.goods}`}</Text>
        ))}
    </SettingSectionLayout>
  );
}

export default ShopInfoShippingGroup;
