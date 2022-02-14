import { Badge, BadgeProps, Box } from '@chakra-ui/react';
import { SellType } from '@prisma/client';

interface SellTypeBadgeProps {
  sellType: SellType;
  lineHeight?: BadgeProps['lineHeight'];
}

export function SellTypeBadge({
  sellType,
  lineHeight = 2,
}: SellTypeBadgeProps): JSX.Element {
  switch (sellType) {
    case 'liveShopping':
      return (
        <Box lineHeight={lineHeight}>
          <Badge colorScheme="green">라이브쇼핑</Badge>
        </Box>
      );
    case 'broadcasterPromotionPage':
      return (
        <Box lineHeight={lineHeight}>
          <Badge colorScheme="red">상품홍보</Badge>
        </Box>
      );
    case 'normal':
      return (
        <Box lineHeight={lineHeight}>
          <Badge colorScheme="gray">일반판매</Badge>
        </Box>
      );
    default:
      return <></>;
  }
}
export default SellTypeBadge;
