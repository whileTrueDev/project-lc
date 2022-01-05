import { Badge } from '@chakra-ui/react';
import {
  GOODS_STATUS_COLOR,
  GOODS_STATUS,
} from '@project-lc/components-constants/goodsStatus';

export interface GoodsStatusBadgeProps {
  goodsStatus: keyof typeof GOODS_STATUS_COLOR;
}
export function GoodsStatusBadge({ goodsStatus }: GoodsStatusBadgeProps): JSX.Element {
  return (
    <Badge colorScheme={GOODS_STATUS_COLOR[goodsStatus]}>
      {GOODS_STATUS[goodsStatus]}
    </Badge>
  );
}

export default GoodsStatusBadge;
