import { Heading, Stack, Text } from '@chakra-ui/react';
import { GoodsByIdRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { GoodsConfirmStatusBadge, GoodsStatusBadge, TextDotConnector } from '..';

export interface GoodsDetailTitleProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailTitle({ goods }: GoodsDetailTitleProps): JSX.Element {
  return (
    <>
      <Heading>{goods.goods_name}</Heading>
      <Stack direction="row" alignItems="center">
        <GoodsStatusBadge goodsStatus={goods.goods_status} />
        <TextDotConnector />
        <GoodsConfirmStatusBadge confirmStatus={goods.confirmation?.status} />
        <TextDotConnector />
        <Text>{dayjs(goods.regist_date).fromNow()}</Text>
      </Stack>
    </>
  );
}
