import { Button, Spinner } from '@chakra-ui/react';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { AdminPolicyWrite } from '@project-lc/components-admin/AdminPolicyWrite';
import { PolicyCategory, PolicyTarget } from '@prisma/client';

export function WritePolicy(): JSX.Element {
  const router = useRouter();
  const { category, targetUser } = router.query;

  const goToList = useCallback(() => router.push('/general/policy'), [router]);

  if (!category || !targetUser) {
    return <Spinner />;
  }
  return (
    <AdminPageLayout>
      <Button onClick={goToList} mb={4}>
        목록으로
      </Button>
      <AdminPolicyWrite
        category={category as PolicyCategory}
        targetUser={targetUser as PolicyTarget}
      />
    </AdminPageLayout>
  );
}

export default WritePolicy;
