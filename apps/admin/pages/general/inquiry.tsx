import { Heading } from '@chakra-ui/react';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { InquiryTable } from '@project-lc/components-admin/InquiryTable';

export default function InquiryTablePage(): JSX.Element {
  return (
    <AdminPageLayout>
      <Heading>문의</Heading>
      <InquiryTable />
    </AdminPageLayout>
  );
}
