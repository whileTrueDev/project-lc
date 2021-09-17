import { Stack, Text } from '@chakra-ui/react';
import { GoodsByIdRes } from '@project-lc/shared-types';

export interface GoodsDetailCommonInfoProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailCommonInfo({ goods }: GoodsDetailCommonInfoProps) {
  return (
    <Stack>
      <Text>{goods.common_contents}</Text>
    </Stack>
  );
}
