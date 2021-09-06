/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Checkbox,
} from '@chakra-ui/react';
import {
  PrepayInfoOptions,
  PrepayInfoTypes,
  ShippingPolicyFormData,
  ShippingSetCodeOptions,
  ShippingSetCodes,
  ShippingSetFormData,
} from '@project-lc/shared-types';
import { Controller, useForm, useFormContext } from 'react-hook-form';

export function ShippingPolicySetForm({
  onSubmit,
}: {
  onSubmit: () => void;
}): JSX.Element {
  // 배송비정책 그룹 폼 컨텍스트
  const groupForm = useFormContext<ShippingPolicyFormData>();

  // 배송설정 폼
  const { register, control, setValue, handleSubmit, watch } =
    useForm<ShippingSetFormData>({
      defaultValues: {
        shippingSetCode: 'delivery',
        shippingSetName: ShippingSetCodeOptions.delivery.label,
        prepayInfo: 'delivery',
      },
    });

  const onTempSetSubmit = (data: ShippingSetFormData) => {
    const prev = groupForm.getValues('shippingSets') || [];
    const tempId = prev.length > 0 ? prev[prev.length - 1].tempId + 1 : 0;
    groupForm.setValue('shippingSets', [...prev, { ...data, tempId }]);
    onSubmit();
  };
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      flexWrap="wrap"
      as="form"
      onSubmit={handleSubmit(onTempSetSubmit)}
      border="1px"
      borderColor="gray.200"
      borderRadius={10}
      spacing={2}
      p={2}
    >
      {/* 배송 설정 이름, 배송 설정 코드, 착불/선불 정보 */}
      <Box>
        <Heading as="h6" size="sm">
          배송 설정명
        </Heading>

        <Stack>
          {/* 배송 설정 이름 */}
          <Input maxLength={50} {...register('shippingSetName')} />

          {/* 배송 설정 코드  */}
          <Controller
            control={control}
            name="shippingSetCode"
            render={({ field: { onChange, ...rest } }) => (
              <Select
                {...rest}
                onChange={(e) => {
                  const key = e.currentTarget
                    .value as keyof typeof ShippingSetCodeOptions;
                  setValue('shippingSetName', ShippingSetCodeOptions[key].label);
                  onChange(e);
                }}
              >
                {ShippingSetCodes.map((key) => (
                  <option key={ShippingSetCodeOptions[key].label} value={key}>
                    {ShippingSetCodeOptions[key].label}
                  </option>
                ))}
              </Select>
            )}
          />

          {/* 선불/착불정보  */}
          <Controller
            control={control}
            name="prepayInfo"
            render={({ field }) => (
              <RadioGroup {...field}>
                <Stack direction="row">
                  {PrepayInfoTypes.map((key) => (
                    <Radio value={key} key={key}>
                      {PrepayInfoOptions[key].label}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            )}
          />
        </Stack>
      </Box>
      {/* 배송 설정 이름, 배송 설정 코드, 착불/선불 정보 */}

      {/* 반품 배송비 */}
      <Box>
        <Heading as="h6" size="sm">
          반품 배송비
        </Heading>
        <Text>반품 편도 : </Text>
        <Input type="number" {...register('refundShippingCost')} />
        <Checkbox {...register('shipingFreeFlag')}>
          배송비가 무료인 경우, 반품배송비 왕복 &nbsp;
          {((watch('refundShippingCost') || 0) * 2).toLocaleString()}₩ 받음
        </Checkbox>
        <Text>(맞)교환 왕복 : </Text>
        <Input type="number" {...register('swapShippingCost')} />
      </Box>
      {/* 반품 배송비 */}

      {/* 배송비 */}
      <Box />
      {/* 배송비 */}
      <Button type="submit">추가하기</Button>
    </Stack>
  );
}

export default ShippingPolicySetForm;
