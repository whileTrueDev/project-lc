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
          <Badge variant="outline" colorScheme="blue">
            적립
          </Badge>
        </Box>
      );
    case 'consume':
    default:
      return (
        <Box lineHeight={lineHeight}>
          <Badge variant="outline" colorScheme="red">
            사용
          </Badge>
        </Box>
      );
  }
}
