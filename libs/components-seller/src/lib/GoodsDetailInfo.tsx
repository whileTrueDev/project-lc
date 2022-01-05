import { Box, Stack, Text } from '@chakra-ui/react';
import { GOODS_CANCEL_TYPE } from '@project-lc/components-constants/goodsRegistTypes';
import { GoodsConfirmStatusBadge } from '@project-lc/components-shared/GoodsConfirmStatusBadge';
import GoodsStatusBadge from '@project-lc/components-shared/GoodsStatusBadge';
import { GoodsByIdRes } from '@project-lc/shared-types';

export interface GoodsDetailInfoProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailInfo({ goods }: GoodsDetailInfoProps): JSX.Element {
  return (
    <Stack>
      <Box>
        <Text fontWeight="bold">상품명</Text>
        <Text>{goods.goods_name}</Text>
      </Box>

      <Box>
        <Text fontWeight="bold">간략설명</Text>
        <Text>{goods.summary}</Text>
      </Box>

      <Box>
        <Text fontWeight="bold">판매상태</Text>
        <GoodsStatusBadge goodsStatus={goods.goods_status} />
      </Box>

      <Box>
        <Text fontWeight="bold">검수 여부</Text>
        <GoodsConfirmStatusBadge confirmStatus={goods.confirmation?.status} />
      </Box>

      <Box>
        <Text fontWeight="bold">청약철회(취소,환불,교환) 가능여부</Text>
        <Text>
          {GOODS_CANCEL_TYPE.find((type) => type.value === goods.cancel_type)?.label}
        </Text>
      </Box>
    </Stack>
  );
}
