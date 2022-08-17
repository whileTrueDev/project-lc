import {
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightAddon,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { AmountUnit } from '@prisma/client';
import { LiveShoppingSpecialPriceDiscountType } from '@project-lc/shared-types';
import { useFormContext } from 'react-hook-form';

export function LiveShoppingSpecialPriceDiscountTypeAndRate(): JSX.Element {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<LiveShoppingSpecialPriceDiscountType>();
  return (
    <Stack direction="row" height={10}>
      <RadioGroup
        onChange={(value) => {
          setValue('discountType', value as AmountUnit);
          setValue('discountRate', undefined);
        }}
        defaultValue="W"
      >
        <Stack direction="row">
          <Radio {...register('discountType')} value="W">
            할인가 입력(원)
          </Radio>
          <Radio {...register('discountType')} value="P">
            할인율 입력(%)
          </Radio>
        </Stack>
      </RadioGroup>

      {watch('discountType') === 'P' && (
        <FormControl isInvalid={!!errors.discountRate} width="auto">
          <InputGroup size="sm">
            <Input
              width="50px"
              type="number"
              {...register('discountRate', {
                valueAsNumber: true,
                max: { value: 100, message: '최대값은 100입니다' },
                min: { value: 0, message: '최소값은 0입니다' },
              })}
            />
            <InputRightAddon>%</InputRightAddon>
          </InputGroup>
          <FormErrorMessage>
            {errors.discountRate && errors.discountRate.message}
          </FormErrorMessage>
        </FormControl>
      )}
    </Stack>
  );
}

export default LiveShoppingSpecialPriceDiscountTypeAndRate;
