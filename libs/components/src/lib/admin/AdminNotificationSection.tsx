import { EmailIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { GridColumns, GridSelectionModel } from '@material-ui/data-grid';
import { useAdminBroadcaster, useAdminSellerList } from '@project-lc/hooks';
import React, { useMemo, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { ChakraDataGrid } from '../ChakraDataGrid';
import {
  escapeRegExp,
  QuickSearchInput,
  QuickSearchInputProps,
} from '../QuickSearchInput';

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

const broadcasterColumns: GridColumns = [
  { field: 'id', hide: true },
  { field: 'email', headerName: '방송인 이메일' },
  { field: 'userNickname', headerName: '방송인 활동명' },
];

export type AdminSendNotificationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  targetUsers: any;
};

function AdminSendNotificationDialog({
  targetUsers,
  isOpen,
  onClose,
}: AdminSendNotificationDialogProps): JSX.Element {
  const formMethods = useForm();
  const onSubmit = (): void => {
    console.log('submit');
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <FormProvider {...formMethods}>
        <ModalContent as="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <ModalHeader>메시지 보내기</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>받는사람 </Text>
            {JSON.stringify(targetUsers, null, 2)}
            <Text>보낼 제목 </Text>
            <Text>메시지 </Text>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button>보내기</Button>
          </ModalFooter>
        </ModalContent>
      </FormProvider>
    </Modal>
  );
}

export interface UserSearchToolbarProps extends QuickSearchInputProps {
  onButtonClick?: () => void;
  isButtonDisabled?: boolean;
}

/** 검색창, 메시지보내기 버튼 있는 툴바 */
function UserSearhToolbar({
  clearSearch,
  onChange,
  value,
  onButtonClick,
  isButtonDisabled,
}: UserSearchToolbarProps): JSX.Element {
  return (
    <Flex direction="row" justifyContent="space-between" mb={1}>
      <QuickSearchInput
        maxW={400}
        mr={1}
        clearSearch={clearSearch}
        onChange={onChange}
        value={value}
      />
      <Button
        leftIcon={<EmailIcon />}
        onClick={onButtonClick}
        isDisabled={isButtonDisabled}
      >
        메시지 보내기
      </Button>
    </Flex>
  );
}

export function AdminNotificationSection(): JSX.Element {
  // 판매자 관련
  const { data: sellerList } = useAdminSellerList();

  const [searchText, setSearchText] = useState<string>('');
  const requestSearch = (searchValue: string): void => {
    setSearchText(searchValue);
  };

  const sellerListRows = useMemo(() => {
    if (!sellerList) return [];
    const searchRegex = new RegExp(escapeRegExp(searchText), 'i');

    // row 데이터가 중첩된 객체인 경우 내부 값까지 확인함 예)row.sellerShop.shopName
    function _searchTextInRow(row: any): boolean {
      return Object.keys(row).some((field: any) => {
        if (!row[field]) return false;
        if (typeof row[field] === 'object') {
          return _searchTextInRow(row[field]);
        }
        return searchRegex.test(row[field].toString());
      });
    }

    return sellerList.filter(_searchTextInRow);
  }, [searchText, sellerList]);

  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  const selectedUser = useMemo(() => {
    if (!selectionModel.length) return [];
    return sellerListRows.filter((row) => selectionModel.includes(row.id));
  }, [selectionModel, sellerListRows]);

  const messageDialog = useDisclosure();
  // 방송인 관련
  const { data: broadcasterList } = useAdminBroadcaster();
  return (
    <Stack direction={{ base: 'column', md: 'row' }} spacing={10}>
      <Box flex={1}>
        <Text>판매자</Text>
        <ChakraDataGrid
          components={{ Toolbar: UserSearhToolbar }}
          density="compact"
          columns={sellerColumns.map((c) => ({ ...c, flex: 1 }))}
          rows={sellerListRows}
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
                requestSearch(e.target.value),
              clearSearch: () => requestSearch(''),
              onButtonClick: messageDialog.onOpen,
              isButtonDisabled: !selectionModel.length,
            },
          }}
          selectionModel={selectionModel}
          onSelectionModelChange={setSelectionModel}
        />
        <AdminSendNotificationDialog
          targetUsers={selectedUser}
          isOpen={messageDialog.isOpen}
          onClose={messageDialog.onClose}
        />
      </Box>
      <Box flex={1}>
        <Text>방송인</Text>
        <ChakraDataGrid
          density="compact"
          columns={broadcasterColumns.map((c) => ({ ...c, flex: 1 }))}
          rows={broadcasterList || []}
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoHeight
          checkboxSelection
          disableColumnMenu
          disableSelectionOnClick
        />
      </Box>
    </Stack>
  );
}

export default AdminNotificationSection;
