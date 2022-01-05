import { Badge, BadgeProps } from '@chakra-ui/react';
import { GoodsConfirmationStatuses } from '@prisma/client';
import { GOODS_CONFIRMATION_STATUS } from '@project-lc/components-constants/goodsStatus';

export interface GoodsConfirmStatusBadgeProps {
  variant?: BadgeProps['variant'];
  confirmStatus?: keyof typeof GoodsConfirmationStatuses;
}
export function GoodsConfirmStatusBadge({
  variant = 'outline',
  confirmStatus = 'waiting',
}: GoodsConfirmStatusBadgeProps): JSX.Element | null {
  if (!confirmStatus) return null;
  return (
    <Badge
      variant={variant}
      colorScheme={GOODS_CONFIRMATION_STATUS[confirmStatus].colorScheme}
    >
      {GOODS_CONFIRMATION_STATUS[confirmStatus].label}
    </Badge>
  );
}
