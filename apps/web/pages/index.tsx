import {
  Navbar,
  Features,
  TestComponent,
  ColorModeSwitcher,
  CommonFooter,
} from '@project-lc/components';
import { Box, Flex } from '@chakra-ui/react';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
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
