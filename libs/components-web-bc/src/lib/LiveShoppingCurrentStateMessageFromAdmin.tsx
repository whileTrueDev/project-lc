import { Box } from '@chakra-ui/react';

export interface LiveShoppingCurrentStateMessageFromAdminProps {
  propname?: any;
}
export function LiveShoppingCurrentStateMessageFromAdmin({
  propname,
}: LiveShoppingCurrentStateMessageFromAdminProps): JSX.Element {
  return (
    // TODO 관리자 메시지를 표시해야함
    <Box border="1px" p={4}>
      관리자 메시지 :
    </Box>
  );
}

export default LiveShoppingCurrentStateMessageFromAdmin;
