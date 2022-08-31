import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import NextLink from 'next/link';
import { Link, Button } from '@chakra-ui/react';

export function AdminOverlayThemeIndex(): JSX.Element {
  return (
    <AdminPageLayout>
      <NextLink passHref href="/overlay-theme/add">
        <Button as={Link}>테마 추가하기</Button>
      </NextLink>
      {/* 목록 */}
    </AdminPageLayout>
  );
}

export default AdminOverlayThemeIndex;
