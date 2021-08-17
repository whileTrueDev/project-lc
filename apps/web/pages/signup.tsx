import { Box, Flex } from '@chakra-ui/react';
import { Navbar, SignupForm } from '@project-lc/components';

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
