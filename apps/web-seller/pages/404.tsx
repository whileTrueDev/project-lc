import { Flex } from '@chakra-ui/react';
import { sellerFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import { Custom404 } from '@project-lc/components-shared/Custom404';
import { SellerNavbar } from '@project-lc/components-shared/Navbar';

export function Page404(): JSX.Element {
  return (
    <Flex minH="100vh" justify="space-between" flexDirection="column">
      <SellerNavbar />

      <Custom404 />

      <CommonFooter footerLinkList={sellerFooterLinkList} />
    </Flex>
  );
}

export default Page404;
