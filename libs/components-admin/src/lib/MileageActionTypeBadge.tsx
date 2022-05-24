import { Badge, Box } from '@chakra-ui/react';
import { MileageActionType } from '@prisma/client';

type MileageActionTypeBadgeProps = {
  actionType: MileageActionType;
  lineHeight: number;
};
export function MileageActionTypeBadge(props: MileageActionTypeBadgeProps): JSX.Element {
  const { actionType, lineHeight } = props;
  switch (actionType) {
    case 'earn':
      return (
        <Box lineHeight={lineHeight}>
          <Badge colorScheme="red">적립</Badge>
        </Box>
      );
    case 'consume':
    default:
      return (
        <Box lineHeight={lineHeight}>
          <Badge colorScheme="blue">사용</Badge>
        </Box>
      );
  }
}
