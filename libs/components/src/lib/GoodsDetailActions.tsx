import { Box, Stack, Text } from '@chakra-ui/react';
import { GoodsByIdRes } from '@project-lc/shared-types';
import { GoodsExposeSwitch } from './GoodsExposeSwitch';

export interface GoodsDetailActionsProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailActions({ goods }: GoodsDetailActionsProps): JSX.Element {
  return (
    <Stack>
      {/* <HStack>
        <Button>버튼1</Button>
        <Button>버튼2</Button>
      </HStack> */}
      <Box>
        <Text>상품노출 상태변경</Text>
        <GoodsExposeSwitch
          goodsId={goods.id}
          goodsView={goods.goods_view}
          confirmedGoodsId={goods.confirmation?.firstmallGoodsConnectionId || undefined}
        />
      </Box>
    </Stack>
  );
}
