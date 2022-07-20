import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { useAdminBroadcasterPromotionPage } from '@project-lc/hooks';

const columns: GridColumns = [
  {
    field: 'id',
    headerName: '고유ID',
    width: 120,
    renderCell: ({ row }: GridRowData) => {
      return (
        <NextLink href={`promotion-page/${row.id}`} passHref>
          <Link color="blue">{row.id}</Link>
        </NextLink>
      );
    },
  },
  {
    field: 'broadcaster',
    headerName: '방송인 활동명',
    renderCell: ({ row }: GridRowData) => {
      return <Text>{row.broadcaster.userNickname}</Text>;
    },
    width: 200,
  },
  {
    field: 'url',
    headerName: '페이지 주소',
    renderCell: ({ row }: GridRowData) => {
      return (
        <Link href={row.url} isExternal color="blue.500">
          {row.url} <ExternalLinkIcon mx="2px" />
        </Link>
      );
    },
    flex: 1,
  },
];
export function AdminBroadcasterPromotionPageList(): JSX.Element {
  const { data, isLoading } = useAdminBroadcasterPromotionPage();
  if (isLoading) return <Box>로딩중...</Box>;

  return (
    <ChakraDataGrid
      borderWidth={0}
      hideFooter
      headerHeight={50}
      minH={300}
      density="compact"
      rows={data || []}
      columns={columns}
      rowCount={5}
      rowsPerPageOptions={[25, 50]}
      disableColumnMenu
      disableColumnFilter
      disableSelectionOnClick
      // onRowClick={handleRowClick}
    />
  );
}

export default AdminBroadcasterPromotionPageList;
