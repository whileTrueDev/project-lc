/* eslint-disable react/jsx-props-no-spreading */
import { Textarea } from '@chakra-ui/react';
import { RegistGoodsDto } from '@project-lc/shared-types';
import { useFormContext } from 'react-hook-form';
import SectionWithTitle from './SectionWithTitle';

export function GoodsRegistMemo(): JSX.Element {
  const { register } = useFormContext<RegistGoodsDto>();
  return (
    <SectionWithTitle title="메모">
      <Textarea {...register('admin_memo')} resize="none" />
    </SectionWithTitle>
  );
}

export default GoodsRegistMemo;
