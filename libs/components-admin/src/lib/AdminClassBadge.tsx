import { Badge, Box, BadgeProps } from '@chakra-ui/react';
import { AdminType } from '@prisma/client';

interface AdminClassBadgeProps {
  adminClass: AdminType | undefined;
  lineHeight?: BadgeProps['lineHeight'];
}

export function AdminClassBadge({
  adminClass,
  lineHeight,
}: AdminClassBadgeProps): JSX.Element {
  switch (adminClass) {
    case 'super':
      return (
        <Box lineHeight={lineHeight}>
          <Badge colorScheme="green">수퍼바이저</Badge>
        </Box>
      );
    case 'full':
      return (
        <Box lineHeight={lineHeight}>
          <Badge colorScheme="blue">개인정보접근가능</Badge>
        </Box>
      );
    case 'normal':
    default:
      return (
        <Box lineHeight={lineHeight}>
          <Badge colorScheme="red">개인정보접근불가능</Badge>
        </Box>
      );
  }
}

export default AdminClassBadge;
