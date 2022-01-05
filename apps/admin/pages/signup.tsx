import { Box, Flex } from '@chakra-ui/react';
import { AdminSignUp } from '@project-lc/components-admin/AdminSignUp';
import { useMoveToMainIfLoggedIn } from '@project-lc/hooks';

export function SignUp(): JSX.Element {
  useMoveToMainIfLoggedIn();
  return (
    <Box>
      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        <AdminSignUp />
      </Flex>
    </Box>
  );
}
export default SignUp;
