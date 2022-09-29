import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { AdminEventPopupListContainer } from '@project-lc/components-admin/kkshow-main/event-popup/AdminEventPopupList';

export function KkshowEventPopupIndex(): JSX.Element {
  return (
    <AdminPageLayout>
      <AdminEventPopupListContainer />
    </AdminPageLayout>
  );
}

export default KkshowEventPopupIndex;
