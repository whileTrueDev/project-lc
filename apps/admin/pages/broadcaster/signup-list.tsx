import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { useCheckAdminClass } from '@project-lc/hooks';
import { AdminBroadcasterSignupList } from '@project-lc/components-admin/AdminBroadcasterSignupList';

export function SignupList(): JSX.Element {
  useCheckAdminClass({
    adminClasses: ['super', 'full'],
    infoType: 'broadcasterList',
    actionType: 'view',
  });

  return (
    <AdminPageLayout>
      <AdminBroadcasterSignupList />
    </AdminPageLayout>
  );
}

export default SignupList;
