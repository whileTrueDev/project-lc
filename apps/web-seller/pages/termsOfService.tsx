import { Policy, PolicyCategory, PolicyTarget } from '@prisma/client';
import PolicyWrapper from '@project-lc/components-shared/PolicyWrapper';
import { getPolicy, usePolicy } from '@project-lc/hooks';
import { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next';

interface TermsofserviceProps {
  policy: Policy;
}

export const getStaticProps: GetStaticProps<TermsofserviceProps> = async (
  context: GetStaticPropsContext,
) => {
  const policy = await getPolicy({
    category: PolicyCategory.termsOfService,
    targetUser: PolicyTarget.seller,
  });
  return { props: { policy } };
};

export function Termsofservice({
  policy,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const { data } = usePolicy(
    {
      category: PolicyCategory.termsOfService,
      targetUser: PolicyTarget.seller,
    },
    policy,
  );
  return <PolicyWrapper appType={PolicyTarget.seller} content={data.content} />;
}

export default Termsofservice;
