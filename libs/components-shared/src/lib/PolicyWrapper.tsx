import { Box, Container, Flex } from '@chakra-ui/react';
import FloatingHelpButton from '@project-lc/components-shared/FloatingHelpButton';
import { Navbar } from '@project-lc/components-shared/Navbar';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import {
  broadcasterFooterLinkList,
  sellerFooterLinkList,
} from '@project-lc/components-constants/footerLinks';
import 'suneditor/dist/css/suneditor.min.css';

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
          <Box
            className="sun-editor-editable"
            dangerouslySetInnerHTML={{ __html: content }}
            p={10}
          />
        </Container>

        <CommonFooter footerLinkList={footerLink} />
      </Flex>
      <FloatingHelpButton />
    </Box>
  );
}

export default PolicyWrapper;
