import { Box, BoxProps } from '@chakra-ui/react';

interface CountBadgeProps {
  count: number;
  top?: BoxProps['top'];
  right?: BoxProps['right'];
}
/** 개수 표시 배지 */
export function CountBadge({ count, top = 0, right = 0 }: CountBadgeProps): JSX.Element {
  return (
    <Box
      as="span"
      color="white"
      position="absolute"
      top={top}
      right={right}
      fontSize="0.5rem"
      bgColor="red"
      borderRadius="full"
      w={4}
    >
      {count > 5 ? `5+` : count}
    </Box>
  );
}
export default CountBadge;
