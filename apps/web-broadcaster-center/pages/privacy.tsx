import { Policy, PolicyCategory, PolicyTarget } from '@prisma/client';
import { PolicyWrapper } from '@project-lc/components-shared/PolicyWrapper';
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
    targetUser: PolicyTarget.broadcaster,
  });
  return { props: { policy } };
};

export function Privacy({
  policy,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const { data } = usePolicy(
    {
      category: PolicyCategory.privacy,
      targetUser: PolicyTarget.broadcaster,
    },
    policy,
  );
  return <PolicyWrapper appType={PolicyTarget.broadcaster} content={data.content} />;
}

export default Privacy;
