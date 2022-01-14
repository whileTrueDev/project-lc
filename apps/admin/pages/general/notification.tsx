import { Heading } from '@chakra-ui/react';
import { AdminNotificationSection } from '@project-lc/components-admin/AdminNotificationSection';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';

export function Notification(): JSX.Element {
  return (
    <AdminPageLayout>
      <Heading>알림메시지</Heading>
      <AdminNotificationSection />
    </AdminPageLayout>
  );
}

export default Notification;
