import { Flex } from '@chakra-ui/react';
import {
  broadcasterFooterLinkList,
  BroadcasterMainBetaDesktop,
  BroadcasterMainBetaMobile,
  BroadcasterNavbar,
  CommonFooter,
  FloatingHelpButton,
  InquiryForm,
} from '@project-lc/components';
import { useDisplaySize } from '@project-lc/hooks';

export function Index(): JSX.Element {
  const { isMobileSize } = useDisplaySize();

  return (
    <div>
      <BroadcasterNavbar />
      <Flex minH="100vh" justify="space-between" flexDirection="column">
        {isMobileSize ? <BroadcasterMainBetaMobile /> : <BroadcasterMainBetaDesktop />}
        <InquiryForm type="broadcaster" />
        <CommonFooter footerLinkList={broadcasterFooterLinkList} />
      </Flex>
      <FloatingHelpButton />
    </div>
  );
}

export default Index;
