import { Box, Flex } from '@chakra-ui/react';
import { CommonFooter, Features, Navbar, TestComponent } from '@project-lc/components';

export function Index(): JSX.Element {
  return (
    <div>
      <Navbar />
      <Flex minH="100vh" justify="space-between" flexDirection="column">
        <Box>
          <TestComponent />
          <Features />
        </Box>
        <CommonFooter />
      </Flex>
    </div>
  );
}

export default Index;
