import { Heading, Stack, Text } from '@chakra-ui/react';
import { useGoodsOnLiveFlag } from '@project-lc/hooks';
import { GoodsByIdRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import {
  GoodsConfirmStatusBadge,
  GoodsEditButton,
  GoodsStatusBadge,
  TextDotConnector,
} from '..';

export interface GoodsDetailTitleProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailTitle({ goods }: GoodsDetailTitleProps): JSX.Element {
  const onLiveShopping = useGoodsOnLiveFlag(goods);
  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Heading>{goods.goods_name}</Heading>
        <GoodsEditButton goodsId={goods.id} onLiveShopping={onLiveShopping} />
      </Stack>

      <Stack direction="row" alignItems="center">
        <GoodsStatusBadge goodsStatus={goods.goods_status} />
        <TextDotConnector />
        <GoodsConfirmStatusBadge confirmStatus={goods.confirmation?.status} />
        <TextDotConnector />
        <Text>{dayjs(goods.regist_date).fromNow()}</Text>
      </Stack>
    </Stack>
  );
}
