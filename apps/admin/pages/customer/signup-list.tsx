import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { useCheckAdminClass } from '@project-lc/hooks';
import { AdminCustomerSignupList } from '@project-lc/components-admin/AdminCustomerSignupList';

export function SignupList(): JSX.Element {
  useCheckAdminClass({
    adminClasses: ['super', 'full'],
    infoType: 'customerList',
    actionType: 'view',
  });

  return (
    <AdminPageLayout>
      <AdminCustomerSignupList />
    </AdminPageLayout>
  );
}

export default SignupList;
