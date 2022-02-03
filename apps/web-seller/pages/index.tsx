import { Flex } from '@chakra-ui/react';
import { sellerFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import { SellerMainFeatureSection } from '@project-lc/components-seller/SellerMainFeatureSection';
import { SellerMainHeader } from '@project-lc/components-seller/SellerMainHeader';
import { SellerMainHowToUseSection } from '@project-lc/components-seller/SellerMainHowToUseSection';
import { SellerMainInquirySection } from '@project-lc/components-seller/SellerMainInquirySection';
import { SellerMainProcessSection } from '@project-lc/components-seller/SellerMainProcessSection';
import { SellerMainReviewSection } from '@project-lc/components-seller/SellerMainReviewSection';
import { FloatingHelpButton } from '@project-lc/components-shared/FloatingHelpButton';
import { SellerNavbar } from '@project-lc/components-shared/Navbar';

export function Index(): JSX.Element {
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
        <CommonFooter footerLinkList={sellerFooterLinkList} />
      </Flex>
      <FloatingHelpButton />
    </div>
  );
}

export default Index;
