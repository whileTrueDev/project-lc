import { Box, Container, Flex } from '@chakra-ui/react';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import {
  broadcasterFooterLinkList,
  sellerFooterLinkList,
} from '@project-lc/components-constants/footerLinks';
import { HtmlStringBox } from '@project-lc/components-core/TermBox';
import { Navbar } from './Navbar';
import FloatingHelpButton from './FloatingHelpButton';

export interface PolicyWrapperProps {
  appType: 'seller' | 'broadcaster';
  content: string;
}
export function PolicyWrapper({ appType, content }: PolicyWrapperProps): JSX.Element {
  const footerLink =
    appType === 'seller' ? sellerFooterLinkList : broadcasterFooterLinkList;
  return (
    <Box>
      <Navbar appType={appType} />
      <Flex minH="100vh" justify="space-between" flexDirection="column">
        <Container maxW="container.xl">
          <HtmlStringBox htmlString={content} p={10} />
        </Container>

        <CommonFooter footerLinkList={footerLink} />
      </Flex>
      <FloatingHelpButton />
    </Box>
  );
}

export default PolicyWrapper;
