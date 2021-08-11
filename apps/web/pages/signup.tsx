import { SignupForm, Navbar, SignupModal } from '@project-lc/components';
import { Box, Flex } from '@chakra-ui/react';

export function Signup(): JSX.Element {
  return (
    <Box>
      <Navbar />
      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        <SignupForm enableShadow />
      </Flex>
    </Box>
  );
}

export default Signup;
