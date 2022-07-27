import { Box, Heading, useToast } from '@chakra-ui/react';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { AdminManagerList } from '@project-lc/components-admin/AdminManagerList';
import { useProfile } from '@project-lc/hooks';
import { useRouter } from 'next/router';

export function AdminManagePage(): JSX.Element {
  const toast = useToast();
  const router = useRouter();
  const { data: profile, isLoading: profileIsLoading } = useProfile();

  if (!profileIsLoading && profile?.adminClass !== 'super') {
    toast({ title: '권한없는 계정', status: 'error' });
    router.push('/admin');
  }

  return (
    <AdminPageLayout>
      <Box>
        <Heading>관리자 계정 관리</Heading>
        <AdminManagerList />
      </Box>
    </AdminPageLayout>
  );
}

export default AdminManagePage;
