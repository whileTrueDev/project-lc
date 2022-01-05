import { Flex } from '@chakra-ui/react';
import { broadcasterFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { FloatingHelpButton } from '@project-lc/components-shared/FloatingHelpButton';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import { InquiryForm } from '@project-lc/components-shared/InquiryForm';
import {
  BroadcasterMainBetaDesktop,
  BroadcasterMainBetaMobile,
} from '@project-lc/components-shared/MainBeta';
import { BroadcasterNavbar } from '@project-lc/components-shared/Navbar';
import { useDisplaySize } from '@project-lc/hooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

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
