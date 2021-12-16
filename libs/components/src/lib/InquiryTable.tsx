import { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Button,
  Link,
  Text,
  useDisclosure,
  useToast,
  Tooltip,
  HStack,
  Spacer,
  Badge,
} from '@chakra-ui/react';
import { GridColumns, GridRowData, GridToolbar } from '@material-ui/data-grid';
import { useAdminInquiry } from '@project-lc/hooks';
import dayjs from 'dayjs';
import { ChakraDataGrid } from './ChakraDataGrid';

export function InquiryTable(): JSX.Element {
  const { data, isLoading } = useAdminInquiry();
  const [pageSize, setPageSize] = useState<number>(10);
  const columns: GridColumns = [
    {
      field: 'type',
      headerName: '타입',
      renderCell: ({ row }: GridRowData) =>
        row.type === 'seller' ? (
          <Badge colorScheme="green">판매자</Badge>
        ) : (
          <Badge colorScheme="red">방송인</Badge>
        ),
    },
    { field: 'name', headerName: '이름' },
    { field: 'content', headerName: '내용', minWidth: 400 },
    { field: 'email', headerName: '이메일', minWidth: 200 },
    { field: 'phoneNumber', headerName: '휴대전화', minWidth: 150 },
    { field: 'homepage', headerName: '홈페이지URL', minWidth: 200 },
    {
      field: 'createDate',
      headerName: '문의날짜',
      minWidth: 150,
      renderCell: ({ row }: GridRowData) =>
        `${dayjs(row.createDate).format('YYYY/MM/DD HH:mm')}`,
    },
    {
      field: 'readFlag',
      headerName: '읽음상태',
      renderCell: ({ row }: GridRowData) =>
        row.readFlag ? <Badge colorScheme="green">읽음</Badge> : <Badge>읽지않음</Badge>,
    },
    {
      field: '',
      headerName: 'd',
      renderCell: ({ row }: GridRowData) =>
        row.readFlag ? <Badge colorScheme="green">읽음</Badge> : <Badge>읽지않음</Badge>,
    },
  ];

  console.log(data);
  return (
    <Box minHeight={{ base: 300, md: 600 }} p={10} mb={24}>
      <HStack>
        {data && !isLoading && (
          <ChakraDataGrid
            width="100%"
            disableExtendRowFullWidth
            autoHeight
            pagination
            autoPageSize
            showFirstButton
            showLastButton
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 15]}
            disableSelectionOnClick
            disableColumnMenu
            disableColumnSelector
            components={{
              Toolbar: GridToolbar,
            }}
            loading={isLoading}
            columns={columns}
            rows={data}
          />
        )}
        <VStack>Hllo</VStack>
      </HStack>
    </Box>
  );
}

export default InquiryTable;
