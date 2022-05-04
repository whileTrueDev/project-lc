import { Input, Stack, Text } from '@chakra-ui/react';
import { useOrderDetail } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ItemSelectSection, { SelectedOrderItem } from './ItemSelectSection';

export interface ExchangeReturnWriteFormProps {
  orderId?: number;
}
export function ExchangeReturnWriteSection({
  orderId,
}: ExchangeReturnWriteFormProps): JSX.Element {
  const router = useRouter();

  const [selectedItems, setSelectedItems] = useState<SelectedOrderItem[]>([]);
  const methods = useForm();
  const onSubmit = (data: any): void => console.log(data);

  const { data, isLoading, isError } = useOrderDetail(orderId);
  if (isLoading) return <Text>loading</Text>;
  if (isError) return <Text>error</Text>;
  if (!data) return <Text>no data</Text>;

  // TODO: if (data.step !== ) step 체크하여 재배송/환불이 불가능한 단계이면 이동시키기
  return (
    <Stack>
      <Text>주문정보 불러와 {orderId}</Text>
      <ItemSelectSection
        orderItems={data.orderItems}
        selectedItems={selectedItems}
        onChange={(items) => setSelectedItems(items)}
      />
      <FormProvider {...methods}>
        <Stack as="form" onSubmit={methods.handleSubmit(onSubmit)}>
          <Text>재배송/환불 사유</Text>
          <Input />
        </Stack>
      </FormProvider>
    </Stack>
  );
}

export default ExchangeReturnWriteSection;
