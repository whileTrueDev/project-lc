import { Container } from '@chakra-ui/react';
import { Policy, PolicyCategory, PolicyTarget } from '@prisma/client';
import { HtmlStringBox } from '@project-lc/components-core/TermBox';
import KkshowLayout from '@project-lc/components-web-kkshow/KkshowLayout';
import { getPolicy, usePolicy } from '@project-lc/hooks';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';

interface TermsofserviceProps {
  policy: Policy;
}

export const getServerSideProps: GetServerSideProps<TermsofserviceProps> = async (
  context: GetServerSidePropsContext,
) => {
  const policy = await getPolicy({
    category: PolicyCategory.termsOfService,
    targetUser: PolicyTarget.customer,
  });
  return { props: { policy } };
};

export function Termsofservice({
  policy,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const { data } = usePolicy(
    {
      category: PolicyCategory.termsOfService,
      targetUser: PolicyTarget.customer,
    },
    policy,
  );
  return (
    <KkshowLayout>
      <Container maxW="container.lg">
        <HtmlStringBox htmlString={data.content} p={10} />
      </Container>
    </KkshowLayout>
  );
}

export default Termsofservice;
