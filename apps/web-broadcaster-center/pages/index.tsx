import { Flex } from '@chakra-ui/react';
import {
  CommonFooter,
  MainBetaDesktop,
  MainBetaMobile,
  Navbar,
} from '@project-lc/components';
import { useDisplaySize } from '@project-lc/hooks';

export function Index(): JSX.Element {
  const { isMobileSize } = useDisplaySize();

  return (
    <div>
      <Navbar />
      <Flex minH="100vh" justify="space-between" flexDirection="column">
        {isMobileSize ? <MainBetaMobile /> : <MainBetaDesktop />}
        <CommonFooter />
      </Flex>
    </div>
  );
}

export default Index;
