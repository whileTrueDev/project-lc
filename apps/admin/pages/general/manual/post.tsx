import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import AdminManualPost from '@project-lc/components-admin/manual/AdminManualPost';

export function Post(): JSX.Element {
  return (
    <AdminPageLayout>
      <AdminManualPost />
    </AdminPageLayout>
  );
}

export default Post;
