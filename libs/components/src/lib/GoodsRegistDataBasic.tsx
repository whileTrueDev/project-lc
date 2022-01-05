import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { RegistGoodsDto } from '@project-lc/shared-types';
import { useFormContext } from 'react-hook-form';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';

export function RequiredMark(): JSX.Element {
  return <Text as="span">*</Text>;
}

export function GoodsRegistDataBasic(): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegistGoodsDto>();
  return (
    <SectionWithTitle title="기본정보" variant="outlined">
      <Stack>
        <FormControl id="goods_name" isInvalid={!!errors.goods_name}>
          <FormLabel>
            상품명 <RequiredMark />
          </FormLabel>
          <Input
            maxLength={180}
            placeholder="상품명을 입력하세요"
            {...register('goods_name', {
              required: '상품명을 입력해주세요',
              maxLength: {
                value: 180,
                message: '상품명은 180자를 초과할 수 없습니다.',
              },
            })}
          />
          {errors.goods_name && (
            <FormErrorMessage>{errors.goods_name.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl id="summary" isInvalid={!!errors.summary}>
          <FormLabel>
            간략설명 <RequiredMark />
          </FormLabel>
          <Input
            maxLength={180}
            placeholder="간략한 상품 설명을 입력하세요"
            {...register('summary', {
              required: '상품 간략 설명을 입력해주세요.',
              maxLength: {
                value: 180,
                message: '상품 간략 설명은 180자를 초과할 수 없습니다.',
              },
            })}
          />
          {errors.summary && (
            <FormErrorMessage>{errors.summary.message}</FormErrorMessage>
          )}
        </FormControl>
      </Stack>
    </SectionWithTitle>
  );
}

export default GoodsRegistDataBasic;
