import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import { broadcasterFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import { FloatingHelpButton } from '@project-lc/components-shared/FloatingHelpButton';
import { KkshowTogether } from '@project-lc/components-shared/KkshowTogether';
import { InquiryDialog } from '@project-lc/components-shared/InquiryForm';
import { BroadcasterNavbar } from '@project-lc/components-shared/Navbar';
import { BroadcasterMainHero } from '@project-lc/components-web-bc/main/BroadcasterMainHero';
import { BroadcasterMainHowToUse } from '@project-lc/components-web-bc/main/BroadcasterMainHowToUse';
import { BroadcasterMainIntroduce } from '@project-lc/components-web-bc/main/BroadcasterMainIntroduce';
import { BroadcasterMainProcess } from '@project-lc/components-web-bc/main/BroadcasterMainProcess';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';

dayjs.extend(relativeTime);

export function Index(): JSX.Element {
  const router = useRouter();
  const inquiry = useDisclosure();
  return (
    <div>
      <Flex minH="100vh" justify="space-between" flexDirection="column">
        <BroadcasterNavbar />

        <BroadcasterMain />

        <KkshowTogether
          buttons={[
            { label: '시작하기', onClick: () => router.push('/login') },
            { label: '문의하기', onClick: () => inquiry.onOpen() },
          ]}
        />

        <CommonFooter footerLinkList={broadcasterFooterLinkList} />
      </Flex>

      <InquiryDialog
        isOpen={inquiry.isOpen}
        onClose={inquiry.onClose}
        type="broadcaster"
      />

      <FloatingHelpButton />
    </div>
  );
}

export default Index;

function BroadcasterMain(): JSX.Element {
  return (
    <Box>
      <BroadcasterMainHero />
      <BroadcasterMainIntroduce />
      <BroadcasterMainProcess />
      <BroadcasterMainHowToUse />
    </Box>
  );
}
