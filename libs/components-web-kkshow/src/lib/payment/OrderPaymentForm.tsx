import { Grid, GridItem, Heading, Stack } from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import { CreateOrderForm } from '@project-lc/shared-types';
import { useKkshowOrderStore } from '@project-lc/stores';
import { FormProvider, useForm } from 'react-hook-form';
import { BuyerInfo } from './BuyerInfo';
import { DeliveryAddress } from './DeliveryAddress';
import { Discount } from './Discount';
import { GiftBox } from './Gift';
import { OrderItemInfo } from './OrderItemInfo';
import { PaymentBox } from './Payment';
import PaymentNotice from './PaymentNotice';
import { PaymentSelection } from './PaymentSelection';

export function OrderPaymentForm(): JSX.Element | null {
  const { data: profile } = useProfile();
  const orderPrepareData = useKkshowOrderStore((s) => s.order);

  const methods = useForm<CreateOrderForm>({
    mode: 'onChange',
    defaultValues: {
      ...orderPrepareData,
      customerId: profile?.id || null,
      ordererName: profile?.name || '',
      ordererEmail: profile?.email || '',
    },
  });

  // if (orderPrepareData.orderItems.length === 0) throw Error('asdf');

  return (
    <FormProvider {...methods}>
      <Grid
        maxW="5xl"
        m="auto"
        templateColumns="repeat(7, 1fr)"
        gap={6}
        px={4}
        py={6}
        mb={{ base: 0, lg: 20 }}
        // TODO: form submit 처리를 여기서 진행하도록 수정 (PaymentBox가 아니라)
        // as="form"
        // onSubmit={methods.handleSubmit(onSubmit)}
      >
        <GridItem colSpan={7}>
          <Heading>주문서</Heading>
        </GridItem>

        <GridItem colSpan={{ base: 7, lg: 5 }}>
          <Stack spacing={6}>
            <BuyerInfo />
            {methods.getValues('giftFlag') ? <GiftBox /> : <DeliveryAddress />}
            <OrderItemInfo />
            <Discount />
            <PaymentSelection />
          </Stack>
        </GridItem>

        <GridItem
          colSpan={{ base: 7, lg: 2 }}
          borderLeftWidth={{ base: 'none', lg: 'thin' }}
        >
          <PaymentBox />
        </GridItem>

        <GridItem colSpan={{ base: 7, lg: 5 }}>
          <PaymentNotice />
        </GridItem>
      </Grid>
    </FormProvider>
  );
}

export default OrderPaymentForm;
