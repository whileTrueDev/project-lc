import { Textarea } from '@chakra-ui/react';
import { RegistGoodsDto } from '@project-lc/shared-types';
import { useFormContext } from 'react-hook-form';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';

export function GoodsRegistMemo(): JSX.Element {
  const { register } = useFormContext<RegistGoodsDto>();
  return (
    <SectionWithTitle title="메모" variant="outlined">
      <Textarea {...register('admin_memo')} resize="none" maxLength={500} />
    </SectionWithTitle>
  );
}

export default GoodsRegistMemo;
