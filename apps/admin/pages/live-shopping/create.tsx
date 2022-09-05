import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { AdminLiveShoppingRegist } from '@project-lc/components-admin/live-shopping/AdminLiveShoppingRegist';

/** 관리자가 라이브쇼핑 생성 -> 판매자, 상품만 등록. 나머지 정보는 라이브쇼핑 수정페이지에서 처리 */
export function CreateLiveShoppingByAdminPage(): JSX.Element {
  return (
    <AdminPageLayout>
      <AdminLiveShoppingRegist />
    </AdminPageLayout>
  );
}

export default CreateLiveShoppingByAdminPage;
