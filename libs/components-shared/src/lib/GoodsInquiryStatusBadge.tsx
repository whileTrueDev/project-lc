import { Badge } from '@chakra-ui/react';
import { GOODS_INQUIRY_STATUS } from '@project-lc/components-constants/goodsInquiryStatus';

export interface GoodsInquiryStatusBadgeProps {
  goodsInquiryStatus: keyof typeof GOODS_INQUIRY_STATUS;
}
export function GoodsInquiryStatusBadge({
  goodsInquiryStatus,
}: GoodsInquiryStatusBadgeProps): JSX.Element | null {
  if (!goodsInquiryStatus) return null;
  return (
    <Badge
      colorScheme={GOODS_INQUIRY_STATUS[goodsInquiryStatus].colorScheme}
      variant="solid"
    >
      {GOODS_INQUIRY_STATUS[goodsInquiryStatus].label}
    </Badge>
  );
}

export default GoodsInquiryStatusBadge;
