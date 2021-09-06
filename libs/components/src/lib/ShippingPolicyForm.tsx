import { Box, Button } from '@chakra-ui/react';
import { ShippingPolicyFormData } from '@project-lc/shared-types';
import { FormProvider, useForm } from 'react-hook-form';
import ShippingPolicyBasicInfo from './ShippingPolicyBasicInfo';
import ShippingPolicyHeader from './ShippingPolicyHeader';
import ShippingPolicyRelatedGoods from './ShippingPolicyRelatedGoods';
import ShippingPolicySetList from './ShippingPolicySetList';

export function ShippingPolicyForm(): JSX.Element {
  const methods = useForm<ShippingPolicyFormData>({
    defaultValues: { shippingCalculType: 'bundle' },
  });
  const onSubmit = (data: ShippingPolicyFormData) => console.log(data);
  return (
    <Box p={4}>
      {/* 헤더 */}
      <ShippingPolicyHeader />

      <FormProvider {...methods}>
        <Box as="form" onSubmit={methods.handleSubmit(onSubmit)}>
          <Button type="submit">test submit</Button>
          {/* 기본정보 */}
          <ShippingPolicyBasicInfo />
        </Box>
        {/* 배송가능국가 : 대한민국 */}
        <ShippingPolicySetList />
        {/* 연결된 상품 */}
        <ShippingPolicyRelatedGoods />

        {/* 배송가능국가 : 해외 - 나중에 필요하면 추가 */}
      </FormProvider>
    </Box>
  );
}

export default ShippingPolicyForm;
