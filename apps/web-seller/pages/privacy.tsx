import { Box, Container, Flex } from '@chakra-ui/react';
import { Policy, PolicyCategory, PolicyTarget } from '@prisma/client';
import { sellerFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import FloatingHelpButton from '@project-lc/components-shared/FloatingHelpButton';
import { SellerNavbar } from '@project-lc/components-shared/Navbar';
import { getPolicy, usePolicy } from '@project-lc/hooks';
import { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next';

interface PrivacyProps {
  policy: Policy;
}

export const getStaticProps: GetStaticProps<PrivacyProps> = async (
  context: GetStaticPropsContext,
) => {
  const policy = await getPolicy({
    category: PolicyCategory.privacy,
    targetUser: PolicyTarget.seller,
  });
  return {
    props: {
      policy,
    },
  };
};

export function Privacy({
  policy,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const { data } = usePolicy(
    {
      category: PolicyCategory.privacy,
      targetUser: PolicyTarget.seller,
    },
    policy,
  );
  return (
    <Box>
      <SellerNavbar />
      <Flex minH="100vh" justify="space-between" flexDirection="column">
        <Container maxW="container.xl">
          <Box dangerouslySetInnerHTML={{ __html: data.content }} p={10} />;
        </Container>

        <CommonFooter footerLinkList={sellerFooterLinkList} />
      </Flex>
      <FloatingHelpButton />
    </Box>
  );
}

export default Privacy;
