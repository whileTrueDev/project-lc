import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { AdminSellerSignupList } from '@project-lc/components-admin/AdminSellerSignupList';
import { useCheckAdminClass } from '@project-lc/hooks';

export function SignupList(): JSX.Element {
  useCheckAdminClass({
    adminClasses: ['super', 'full'],
    infoType: 'sellerList',
    actionType: 'view',
  });

  return (
    <AdminPageLayout>
      <AdminSellerSignupList />
    </AdminPageLayout>
  );
}

export default SignupList;
