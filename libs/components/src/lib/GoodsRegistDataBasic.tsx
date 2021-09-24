/* eslint-disable react/jsx-props-no-spreading */
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { RegistGoodsDto } from '@project-lc/shared-types';
import { useFormContext } from 'react-hook-form';
import SectionWithTitle from './SectionWithTitle';

export function GoodsRegistDataBasic(): JSX.Element {
  const { register } = useFormContext<RegistGoodsDto>();
  return (
    <SectionWithTitle title="기본정보">
      <FormControl id="goods_name" isRequired>
        <FormLabel>상품명</FormLabel>
        <Input
          maxLength={180}
          placeholder="상품명을 입력하세요"
          {...register('goods_name', { required: true, maxLength: 180 })}
        />
      </FormControl>

      <FormControl id="summary">
        <FormLabel>간략설명</FormLabel>
        <Input
          maxLength={180}
          placeholder="간략한 상품 설명을 입력하세요"
          {...register('summary', { required: true, maxLength: 180 })}
        />
      </FormControl>
    </SectionWithTitle>
  );
}

export default GoodsRegistDataBasic;
