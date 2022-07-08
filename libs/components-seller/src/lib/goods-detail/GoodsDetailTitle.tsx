import { Stack, Text } from '@chakra-ui/react';
import TextDotConnector from '@project-lc/components-core/TextDotConnector';
import { GoodsConfirmStatusBadge } from '@project-lc/components-shared/GoodsConfirmStatusBadge';
import GoodsStatusBadge from '@project-lc/components-shared/GoodsStatusBadge';
import { GoodsByIdRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';

export interface GoodsDetailTitleProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailTitle({ goods }: GoodsDetailTitleProps): JSX.Element {
  return (
    <Stack>
      <Text as="h3" fontSize={{ base: 'xl', md: '3xl' }} fontWeight="bold">
        {goods.goods_name}
      </Text>

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
