import { Stack, Text } from '@chakra-ui/react';
import { GoodsByIdRes } from '@project-lc/shared-types';

export interface GoodsDetailMemoProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailMemo({ goods }: GoodsDetailMemoProps): JSX.Element {
  return (
    <Stack>
      <Text>{goods.admin_memo}</Text>
    </Stack>
  );
}
