import { Heading, Grid, GridItem } from '@chakra-ui/react';
import { AdminMileageList } from '@project-lc/components-admin/AdminMileageList';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';

export function MileageIndexPage(): JSX.Element {
  return (
    <AdminPageLayout>
      <Grid templateColumns="repeat(2, 4fr)" gap={5}>
        <GridItem>
          <Heading>마일리지 목록</Heading>
          <AdminMileageList />
        </GridItem>
        <GridItem>
          <Heading>마일리지 로그</Heading>
          <AdminMileageList />
        </GridItem>
      </Grid>
    </AdminPageLayout>
  );
}

export default MileageIndexPage;
