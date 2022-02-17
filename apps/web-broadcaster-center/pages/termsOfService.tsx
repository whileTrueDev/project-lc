import { Policy, PolicyCategory, PolicyTarget } from '@prisma/client';
import PolicyWrapper from '@project-lc/components-shared/PolicyWrapper';
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
    targetUser: PolicyTarget.broadcaster,
  });
  return { props: { policy } };
};

export function Termsofservice({
  policy,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const { data } = usePolicy(
    {
      category: PolicyCategory.termsOfService,
      targetUser: PolicyTarget.broadcaster,
    },
    policy,
  );
  return <PolicyWrapper appType={PolicyTarget.broadcaster} content={data.content} />;
}

export default Termsofservice;
