import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';

export function AdminManualIndex(): JSX.Element {
  return (
    <AdminPageLayout>
      <div> 관리자 이용안내 목록조회 페이지</div>
      <NextLink href="/general/manual/post" passHref>
        <Link>작성하기</Link>
      </NextLink>
    </AdminPageLayout>
  );
}

export default AdminManualIndex;
