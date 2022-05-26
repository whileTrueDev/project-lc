import { Stack } from '@chakra-ui/react';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { RegistGoodsDto } from '@project-lc/shared-types';
import { useFormContext } from 'react-hook-form';

export function GoodsRegistCategory(): JSX.Element {
  const { register } = useFormContext<RegistGoodsDto>();
  return (
    <SectionWithTitle title="카테고리" variant="outlined">
      <Stack>카테고리</Stack>
    </SectionWithTitle>
  );
}

export default GoodsRegistCategory;
