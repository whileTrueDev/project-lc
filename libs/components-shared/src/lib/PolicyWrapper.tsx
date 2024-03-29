import { Box, Container, Flex } from '@chakra-ui/react';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import {
  broadcasterFooterLinkList,
  FooterLinkListItem,
  kkshowFooterLinkList,
  sellerFooterLinkList,
} from '@project-lc/components-constants/footerLinks';
import { HtmlStringBox } from '@project-lc/components-core/TermBox';
import { Navbar } from './Navbar';
import FloatingHelpButton from './FloatingHelpButton';

export interface PolicyWrapperProps {
  appType: 'seller' | 'broadcaster' | 'customer';
  content: string;
}
export function PolicyWrapper({ appType, content }: PolicyWrapperProps): JSX.Element {
  let footerLink: FooterLinkListItem[];
  switch (appType) {
    case 'seller':
      footerLink = sellerFooterLinkList;
      break;
    case 'broadcaster':
      footerLink = broadcasterFooterLinkList;
      break;
    case 'customer':
      footerLink = kkshowFooterLinkList;
      break;
    default:
      footerLink = [];
      break;
  }

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
