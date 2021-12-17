import { Box, Flex } from '@chakra-ui/react';
import { BroadcasterNavbar, ResetPasswordForm } from '@project-lc/components';

export function Resetpassword(): JSX.Element {
  return (
    <Box>
      <BroadcasterNavbar />
      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        <ResetPasswordForm />
      </Flex>
    </Box>
  );
}

export default Resetpassword;
