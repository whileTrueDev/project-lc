import { Flex } from '@chakra-ui/react';
import {
  CommonFooter,
  FloatingHelpButton,
  sellerFooterLinkList,
  SellerMainBetaDesktop,
  SellerMainBetaMobile,
  SellerNavbar,
  InquiryForm,
} from '@project-lc/components';
import { useDisplaySize } from '@project-lc/hooks';

export function Index(): JSX.Element {
  const { isMobileSize } = useDisplaySize();

  return (
    <div>
      <SellerNavbar />
      <Flex minH="100vh" justify="space-between" flexDirection="column">
        {isMobileSize ? <SellerMainBetaMobile /> : <SellerMainBetaDesktop />}
        <InquiryForm type="seller" />
        <CommonFooter footerLinkList={sellerFooterLinkList} />
      </Flex>
      <FloatingHelpButton />
    </div>
  );
}

export default Index;
