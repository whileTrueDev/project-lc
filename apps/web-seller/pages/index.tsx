import { Flex } from '@chakra-ui/react';
import { sellerFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { FloatingHelpButton } from '@project-lc/components-shared/FloatingHelpButton';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
// import { InquiryForm } from '@project-lc/components-shared/InquiryForm';
// import {
//   SellerMainBetaDesktop,
//   SellerMainBetaMobile,
// } from '@project-lc/components-shared/MainBeta';
import { SellerMainHeader } from '@project-lc/components-seller/SellerMainHeader';
import { SellerMainFeatureSection } from '@project-lc/components-seller/SellerMainFeatureSection';
import { SellerMainProcessSection } from '@project-lc/components-seller/SellerMainProcessSection';
import { SellerMainHowToUseSection } from '@project-lc/components-seller/SellerMainHowToUseSection';
import { SellerMainReviewSection } from '@project-lc/components-seller/SellerMainReviewSection';
import { SellerMainInquirySection } from '@project-lc/components-seller/SellerMainInquirySection';
import { SellerNavbar } from '@project-lc/components-shared/Navbar';
import { useDisplaySize } from '@project-lc/hooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function Index(): JSX.Element {
  const { isMobileSize } = useDisplaySize();

  return (
    <div>
      <SellerNavbar />
      <Flex minH="100vh" justify="space-between" flexDirection="column">
        <SellerMainHeader />
        <SellerMainFeatureSection />
        <SellerMainProcessSection />
        <SellerMainHowToUseSection />
        <SellerMainReviewSection />
        <SellerMainInquirySection />
        {/* {isMobileSize ? <SellerMainBetaMobile /> : <SellerMainBetaDesktop />}
        <InquiryForm type="seller" /> */}
        <CommonFooter footerLinkList={sellerFooterLinkList} />
      </Flex>
      <FloatingHelpButton />
    </div>
  );
}

export default Index;
