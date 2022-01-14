import { Box } from '@chakra-ui/react';
import { BroadcasterNavbar } from '@project-lc/components-shared/Navbar';
import { SignupProcess } from '@project-lc/components-shared/SignupProcess';
import { useMoveToMainIfLoggedIn } from '@project-lc/hooks';
import React from 'react';

export function SignUp(): JSX.Element {
  useMoveToMainIfLoggedIn();
  return (
    <Box>
      <BroadcasterNavbar />
      <SignupProcess appType="seller" />
    </Box>
  );
}
export default SignUp;
