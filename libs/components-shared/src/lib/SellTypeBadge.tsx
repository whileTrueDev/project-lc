import { Badge, BadgeProps, Box } from '@chakra-ui/react';
import { SellType } from '@prisma/client';

interface SellTypeBadgeProps {
  sellType: SellType | null;
  lineHeight?: BadgeProps['lineHeight'];
}

export function SellTypeBadge({ sellType, lineHeight }: SellTypeBadgeProps): JSX.Element {
  switch (sellType) {
    case 'liveShopping':
      return (
        <Box lineHeight={lineHeight}>
          <Badge colorScheme="green">라이브쇼핑</Badge>
        </Box>
      );
    case 'productPromotion':
      return (
        <Box lineHeight={lineHeight}>
          <Badge colorScheme="red">상품홍보</Badge>
        </Box>
      );
    case 'normal':
    default:
      return (
        <Box lineHeight={lineHeight}>
          <Badge colorScheme="gray">일반판매</Badge>
        </Box>
      );
  }
}

export default SellTypeBadge;
