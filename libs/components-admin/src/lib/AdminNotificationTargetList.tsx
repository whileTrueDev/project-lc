import { Box, Text, useDisclosure } from '@chakra-ui/react';
import { GridColumns, GridSelectionModel } from '@material-ui/data-grid';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { escapeRegExp } from '@project-lc/components-core/QuickSearchInput';
import { AdminSellerListItem, BroadcasterDTO, UserType } from '@project-lc/shared-types';
import { useMemo, useState } from 'react';
import {
  AdminSendNotificationDialog,
  UserSearhToolbar,
} from './AdminNotificationSection';

export interface AdminNotificationTargetListProps<
  T extends AdminSellerListItem | BroadcasterDTO,
> {
  userList?: T[];
  renderTarget: (target: T) => JSX.Element;
  columns: GridColumns;
  userType: UserType;
  title: string;
}

/**
 * 알림메시지 보낼 유저 목록 데이터그리드, 메시지 보내기 다이얼로그, 유저 검색창 포함한 컴포넌트
 * @param userList : AdminSellerListItem[] | BroadcasterDTO[] 알림 보낼 대상 목록
 * @param renderTarget : 알림 보낼 대상을 어떻게 렌더링할지 결정
 * @param columns : datagrid에 표시될 컬럼 정보
 * @param userType : 'seller' | 'broadcaster'
 * @returns
 */
export function AdminNotificationTargetList<
  T extends AdminSellerListItem | BroadcasterDTO,
>({
  userList,
  renderTarget,
  title,
  columns,
  userType,
}: AdminNotificationTargetListProps<T>): JSX.Element {
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
    <Box flex={1} p={2}>
      <Text fontWeight="bold">{title}</Text>
      <ChakraDataGrid
        components={{ Toolbar: UserSearhToolbar }}
        density="compact"
        columns={columns.map((c) => ({ ...c, flex: 1 }))}
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
        userType={userType}
        targetUsersEmailList={selectedUser.map((user) => user.email)}
        targetDisplay={
          <>
            <Text>받는사람 {selectedUser.length}명</Text>
            <Box maxH={100} overflowY="auto" {...boxStyle}>
              {selectedUser.map(renderTarget)}
            </Box>
          </>
        }
      />
    </Box>
  );
}
