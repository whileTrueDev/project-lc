import { Box, Button } from '@chakra-ui/react';
import { ShippingPolicyFormData } from '@project-lc/shared-types';
import { FormProvider, useForm } from 'react-hook-form';
import ShippingPolicyBasicInfo from './ShippingPolicyBasicInfo';
import ShippingPolicyHeader from './ShippingPolicyHeader';

export function ShippingPolicyForm(): JSX.Element {
  const methods = useForm<ShippingPolicyFormData>();
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
      </FormProvider>
    </Box>
  );
}

export default ShippingPolicyForm;
