import { useDisclosure, Box, Text } from '@chakra-ui/react';
import { GridColumns, GridSelectionModel } from '@material-ui/data-grid';
import { useAdminSellerList } from '@project-lc/hooks';
import { useState, useMemo } from 'react';
import { boxStyle } from '../../constants/commonStyleProps';
import { ChakraDataGrid } from '../ChakraDataGrid';
import { escapeRegExp } from '../QuickSearchInput';
import {
  AdminSendNotificationDialog,
  UserSearhToolbar,
} from './AdminNotificationSection';

const sellerColumns: GridColumns = [
  { field: 'id', hide: true },
  { field: 'email', headerName: '판매자 이메일' },
  { field: 'name', headerName: '판매자 이름' },
  {
    field: 'shopName',
    headerName: '상점명',
    renderCell: (params) => <Text>{params.row.sellerShop?.shopName}</Text>,
  },
];
export function AdminNotificationSellerList(): JSX.Element {
  // 전체 판매자 목록
  const { data: userList } = useAdminSellerList();

  // 검색 텍스트
  const [searchText, setSearchText] = useState<string>('');

  // 데이터그리드에 표시될 유저 목록
  const userListRows = useMemo(() => {
    if (!userList) return [];
    const searchRegex = new RegExp(escapeRegExp(searchText), 'i');

    // row 데이터가 중첩된 객체인 경우 내부 값까지 확인함 예)row.sellerShop.shopName
    function _searchTextInRow(row: any): boolean {
      return Object.keys(row).some((field: any) => {
        // 값이 없거나, key 이름이 id 인경우 제외
        if (!row[field] || field === 'id') return false;
        if (typeof row[field] === 'object') {
          return _searchTextInRow(row[field]);
        }
        return searchRegex.test(row[field].toString());
      });
    }

    return userList.filter(_searchTextInRow);
  }, [searchText, userList]);

  // 선택된 행정보 (id 값만 저장)
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  // 선택된 유저 목록
  const selectedUser = useMemo(() => {
    if (!selectionModel.length) return [];
    return userListRows.filter((row) => selectionModel.includes(row.id));
  }, [selectionModel, userListRows]);

  const messageDialog = useDisclosure();
  return (
    <Box flex={1}>
      <Text>판매자</Text>
      <ChakraDataGrid
        components={{ Toolbar: UserSearhToolbar }}
        density="compact"
        columns={sellerColumns.map((c) => ({ ...c, flex: 1 }))}
        rows={userListRows}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
        checkboxSelection
        disableColumnMenu
        disableSelectionOnClick
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchText(e.target.value),
            clearSearch: () => setSearchText(''),
            onButtonClick: messageDialog.onOpen,
            isButtonDisabled: !selectionModel.length,
          },
        }}
        selectionModel={selectionModel}
        onSelectionModelChange={setSelectionModel}
      />
      <AdminSendNotificationDialog
        isOpen={messageDialog.isOpen}
        onClose={messageDialog.onClose}
        userType="seller"
        targetUsersEmailList={selectedUser.map((user) => user.email)}
        targetDisplay={
          <>
            <Text>받는사람 {selectedUser.length}명 - 판매자 이름 (상점명)</Text>
            <Box maxH={100} overflowY="auto" {...boxStyle}>
              {selectedUser.map((user) => (
                <Text key={user.email}>
                  - {user.name} ({user.sellerShop?.shopName})
                </Text>
              ))}
            </Box>
          </>
        }
      />
    </Box>
  );
}

export default AdminNotificationSellerList;
