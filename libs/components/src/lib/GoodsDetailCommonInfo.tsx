import { Stack, Text } from '@chakra-ui/react';
import { GoodsByIdRes } from '@project-lc/shared-types';

export interface GoodsDetailCommonInfoProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailCommonInfo({ goods }: GoodsDetailCommonInfoProps) {
  return (
    <Stack>
      <Text fontWeight="bold">상품공통정보</Text>
      <Text>{goods.common_contents}</Text>
    </Stack>
  );
}
