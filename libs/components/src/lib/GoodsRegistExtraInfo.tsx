import {
  Radio,
  RadioGroup,
  Text,
  Input,
  HStack,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { RegistGoodsDto } from '@project-lc/shared-types';
import { useFormContext } from 'react-hook-form';
import SectionWithTitle from './SectionWithTitle';
import { ErrorText } from './ShippingOptionIntervalApply';

export function GoodsRegistExtraInfo(): JSX.Element {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RegistGoodsDto>();
  return (
    <SectionWithTitle title="기타정보" variant="outlined">
      {/* 최소 구매 수량 */}
      <FormControl mb={2}>
        <FormLabel fontWeight="bold">최소 구매 수량</FormLabel>
        <RadioGroup
          value={watch('min_purchase_limit')}
          onChange={(value) => {
            if (value === 'unlimit') {
              setValue('min_purchase_ea', undefined);
            } else {
              setValue('min_purchase_ea', 2);
            }
          }}
        >
          <Radio {...register('min_purchase_limit')} value="unlimit">
            최소1개
          </Radio>
          <HStack flexWrap="wrap">
            <Radio {...register('min_purchase_limit')} value="limit">
              최소
            </Radio>
            <Input
              type="number"
              disabled={watch('min_purchase_limit') === 'unlimit'}
              w={20}
              {...register('min_purchase_ea', {
                valueAsNumber: true,
                min: { value: 2, message: '최소 구매수량은 2개 이상이어야 합니다' },
              })}
            />
            <Text>개 이상 구매 가능</Text>
            <Text>(2 이상 입력가능)</Text>
          </HStack>
        </RadioGroup>
        <ErrorText>{errors.min_purchase_ea && errors.min_purchase_ea.message}</ErrorText>
      </FormControl>

      {/* 최대 구매 수량 */}
      <FormControl>
        <FormLabel fontWeight="bold">최대 구매 수량</FormLabel>
        <RadioGroup
          value={watch('max_purchase_limit')}
          onChange={(value) => {
            if (value === 'unlimit') {
              setValue('max_purchase_ea', undefined);
            } else {
              setValue('max_purchase_ea', watch('min_purchase_ea') || 1);
            }
          }}
        >
          <Radio {...register('max_purchase_limit')} value="unlimit">
            제한 없음
          </Radio>
          <HStack flexWrap="wrap">
            <Radio {...register('max_purchase_limit')} value="limit">
              최대
            </Radio>
            <Input
              type="number"
              disabled={watch('max_purchase_limit') === 'unlimit'}
              w={20}
              {...register('max_purchase_ea', {
                valueAsNumber: true,
                min: {
                  value: watch('min_purchase_ea') || 1,
                  message: '최대 구매 수량은 최소 구매 수량보다 커야 합니다',
                },
              })}
            />
            <Text>개 이하 구매가능</Text>
            <Text>(최소 구매 수량보다 큰 수)</Text>
          </HStack>
        </RadioGroup>
        <ErrorText>{errors.min_purchase_ea && errors.min_purchase_ea.message}</ErrorText>
      </FormControl>
    </SectionWithTitle>
  );
}

export default GoodsRegistExtraInfo;
