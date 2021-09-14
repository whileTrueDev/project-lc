import { GridColumns } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { useColorModeValue } from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import dayjs from 'dayjs';
import { ChakraDataGrid } from '../ChakraDataGrid';

const columns: GridColumns = [
  {
    field: 'email',
    headerName: '광고주 이메일',
  },
  {
    field: 'bank',
    headerName: '은행명',
  },
  {
    field: 'number',
    headerName: '계좌번호',
  },
  {
    field: 'name',
    headerName: '예금주',
  },
];

function makeListRow(sellerAccounts: any[] | undefined) {
  if (!sellerAccounts) {
    return [];
  }
  return sellerAccounts.map((element, index: number) => {
    return { ...element, id: index, isRowSelectable: false };
  });
}

// 관리자가 볼 계좌번호 등록 리스트
export function AdminAccountList(props: { sellerAccounts: any[] }): JSX.Element {
  const { isDesktopSize } = useDisplaySize();
  const { sellerAccounts } = props;
  const useStyle = makeStyles({
    columnHeader: {
      backgroundColor: useColorModeValue('inherit', '#2D3748'),
    },
    root: {
      borderWidth: 0,
      color: useColorModeValue('inherit', `rgba(255, 255, 255, 0.92)`),
      height: '95%',
    },
  });

  const classes = useStyle();

  return (
    <ChakraDataGrid
      classes={{
        columnHeader: classes.columnHeader,
        root: classes.root,
      }}
      borderWidth={0}
      hideFooter
      headerHeight={50}
      minH={300}
      density="compact"
      columns={columns.map((x) => ({ ...x, flex: isDesktopSize ? 1 : undefined }))}
      rows={makeListRow(sellerAccounts)}
      rowCount={5}
      rowsPerPageOptions={[25, 50]}
      disableColumnMenu
      disableColumnFilter
      disableSelectionOnClick
    />
  );
}
