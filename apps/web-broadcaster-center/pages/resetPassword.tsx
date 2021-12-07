import { Box, Flex } from '@chakra-ui/react';
import { BroadcasterNavbar, ResetPasswordForm } from '@project-lc/components';
import { UserType } from '@project-lc/shared-types';

export function Resetpassword(): JSX.Element {
  return (
    <Box>
      <BroadcasterNavbar />
      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        <ResetPasswordForm userType={process.env.NEXT_PUBLIC_APP_TYPE as UserType} />
      </Flex>
    </Box>
  );
}

export default Resetpassword;
