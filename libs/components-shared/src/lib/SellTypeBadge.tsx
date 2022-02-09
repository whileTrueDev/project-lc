import { Badge, Box } from '@chakra-ui/react';
import { SellType } from '@prisma/client';

interface SellTypeBadgeProps {
  sellType: SellType;
}

export function SellTypeBadge({ sellType }: SellTypeBadgeProps): JSX.Element {
  switch (sellType) {
    case 'liveShopping':
      return (
        <Box lineHeight={2}>
          <Badge colorScheme="green">라이브쇼핑</Badge>
        </Box>
      );
    case 'broadcasterPromotionPage':
      return (
        <Box lineHeight={2}>
          <Badge colorScheme="red">홍보페이지</Badge>
        </Box>
      );
    case 'normal':
      return (
        <Box lineHeight={2}>
          <Badge colorScheme="gray">일반판매</Badge>
        </Box>
      );
    default:
      return <></>;
  }
}
export default SellTypeBadge;
