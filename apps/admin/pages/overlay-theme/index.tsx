import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import NextLink from 'next/link';
import { Link, Button } from '@chakra-ui/react';
import { OverlayThemeListSection } from '@project-lc/components-admin/overlay-theme/OverlayThemeListSection';

export function AdminOverlayThemeIndex(): JSX.Element {
  return (
    <AdminPageLayout>
      <NextLink passHref href="/overlay-theme/add">
        <Button as={Link} mb={4} colorScheme="blue">
          테마 추가하기
        </Button>
      </NextLink>
      {/* 목록 */}
      <OverlayThemeListSection />
    </AdminPageLayout>
  );
}

export default AdminOverlayThemeIndex;
