import { Flex } from '@chakra-ui/react';
import {
  CommonFooter,
  SellerMainBetaDesktop,
  SellerMainBetaMobile,
  Navbar,
  sellerFooterLinkList,
} from '@project-lc/components';
import { useDisplaySize } from '@project-lc/hooks';

export function Index(): JSX.Element {
  const { isMobileSize } = useDisplaySize();

  return (
    <div>
      <Navbar />
      <Flex minH="100vh" justify="space-between" flexDirection="column">
        {isMobileSize ? <SellerMainBetaMobile /> : <SellerMainBetaDesktop />}
        <CommonFooter footerLinkList={sellerFooterLinkList} />
      </Flex>
    </div>
  );
}

export default Index;
