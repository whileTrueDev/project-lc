import { Heading } from '@chakra-ui/react';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { AdminPolicySection } from '@project-lc/components-admin/AdminPolicySection';

export function Notification(): JSX.Element {
  return (
    <AdminPageLayout>
      <Heading>이용정책, 개인정보처리방침</Heading>
      <AdminPolicySection />
    </AdminPageLayout>
  );
}

export default Notification;
