import { Policy, PolicyCategory, PolicyTarget } from '@prisma/client';
import PolicyWrapper from '@project-lc/components-shared/PolicyWrapper';
import { getPolicy, usePolicy } from '@project-lc/hooks';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';

interface PrivacyProps {
  policy: Policy;
}

export const getServerSideProps: GetServerSideProps<PrivacyProps> = async (
  context: GetServerSidePropsContext,
) => {
  const policy = await getPolicy({
    category: PolicyCategory.privacy,
    targetUser: PolicyTarget.seller,
  });
  return { props: { policy } };
};

export function Privacy({
  policy,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const { data } = usePolicy(
    {
      category: PolicyCategory.privacy,
      targetUser: PolicyTarget.seller,
    },
    policy,
  );
  return <PolicyWrapper appType={PolicyTarget.seller} content={data.content} />;
}

export default Privacy;
