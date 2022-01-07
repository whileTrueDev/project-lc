import { AdminNotificationSection } from '@project-lc/components-admin/AdminNotificationSection';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';

export function Notification(): JSX.Element {
  return (
    <AdminPageLayout>
      <AdminNotificationSection />
    </AdminPageLayout>
  );
}

export default Notification;
