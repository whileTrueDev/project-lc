import { Box, Stack, Text } from '@chakra-ui/react';
import { useGoodsOnLiveFlag } from '@project-lc/hooks';
import { GoodsByIdRes } from '@project-lc/shared-types';
import { GoodsExposeSwitch } from '../GoodsExposeSwitch';

export interface GoodsDetailActionsProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailActions({ goods }: GoodsDetailActionsProps): JSX.Element {
  const onLiveShopping = useGoodsOnLiveFlag(goods);
  return (
    <Stack>
      <Box>
        <Text>상품노출 상태변경</Text>
        <GoodsExposeSwitch
          goodsId={goods.id}
          goodsView={goods.goods_view}
          confirmedGoodsId={goods.confirmation?.firstmallGoodsConnectionId || undefined}
          isReadOnly={onLiveShopping}
        />
      </Box>
    </Stack>
  );
}
