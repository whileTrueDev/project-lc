import { Heading, Grid, GridItem } from '@chakra-ui/react';
import { AdminMileageList } from '@project-lc/components-admin/AdminMileageList';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { AdminMileageLogList } from '@project-lc/components-admin/AdminMileageLogList';

export function MileageIndexPage(): JSX.Element {
  return (
    <AdminPageLayout>
      <Grid templateColumns="repeat(3, 1fr)" gap={5}>
        <GridItem>
          <Heading>마일리지 목록</Heading>
          <AdminMileageList />
        </GridItem>
        <GridItem colSpan={2}>
          <Heading>마일리지 로그</Heading>
          <AdminMileageLogList />
        </GridItem>
      </Grid>
    </AdminPageLayout>
  );
}

export default MileageIndexPage;
