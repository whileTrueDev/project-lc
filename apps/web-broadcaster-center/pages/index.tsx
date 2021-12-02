import { Flex } from '@chakra-ui/react';
import {
  CommonFooter,
  BroadcasterMainBetaDesktop,
  BroadcasterMainBetaMobile,
  Navbar,
  broadcasterFooterLinkList,
} from '@project-lc/components';
import { useDisplaySize } from '@project-lc/hooks';

export function Index(): JSX.Element {
  const { isMobileSize } = useDisplaySize();

  return (
    <div>
      <Navbar siteType="broadcaster" />
      <Flex minH="100vh" justify="space-between" flexDirection="column">
        {isMobileSize ? <BroadcasterMainBetaMobile /> : <BroadcasterMainBetaDesktop />}
        <CommonFooter footerLinkList={broadcasterFooterLinkList} />
      </Flex>
    </div>
  );
}

export default Index;
