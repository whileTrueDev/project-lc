import { Box } from '@chakra-ui/react';

export interface LiveShoppingCurrentStateMessageFromAdminProps {
  message?: string;
}
export function LiveShoppingCurrentStateMessageFromAdmin({
  message,
}: LiveShoppingCurrentStateMessageFromAdminProps): JSX.Element {
  return (
    <Box border="1px" p={4}>
      관리자 메시지 : {message}
    </Box>
  );
}

export default LiveShoppingCurrentStateMessageFromAdmin;
