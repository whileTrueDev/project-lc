import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { GridColumns, GridRowData, GridToolbar } from '@material-ui/data-grid';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { useAdminInquiry, useChangeInquiryReadFlagMutation } from '@project-lc/hooks';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import AdminDatagridWrapper, {
  NOT_CHECKED_BY_ADMIN_CLASS_NAME,
} from './AdminDatagridWrapper';

export function InquiryTable(): JSX.Element {
  const { data, isLoading } = useAdminInquiry();
  const { mutateAsync } = useChangeInquiryReadFlagMutation();
  const queryClient = useQueryClient();

  const [pageSize, setPageSize] = useState<number>(10);
  const [inquiryIndex, setInquiryIndex] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const handleOpen = (id: number): void => {
    const index = data?.findIndex((x) => x.id === id) || 0;
    setInquiryIndex(index);
    onOpen();
  };

  const handleUpdateReadFlag = (id: number): void => {
    mutateAsync(id).then(onSuccess).catch(onFail);
  };

  const onSuccess = (): void => {
    queryClient.invalidateQueries('getAdminInquiry');
    toast({
      title: '읽음으로 처리하였습니다',
      status: 'success',
    });
  };

  const onFail = (): void => {
    toast({
      title: '오류가 발생하였습니다',
      status: 'error',
    });
  };

  const columns: GridColumns = [
    {
      field: '',
      headerName: '',
      renderCell: ({ row }: GridRowData) =>
        row.readFlag ? null : (
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => {
              handleUpdateReadFlag(row.id);
            }}
          >
            읽음처리
          </Button>
        ),
    },
    {
      field: 'readFlag',
      headerName: '상태',
      renderCell: ({ row }: GridRowData) =>
        row.readFlag ? (
          <Box lineHeight={2}>
            <Badge colorScheme="green">읽음</Badge>
          </Box>
        ) : (
          <Box lineHeight={2}>
            <Badge>읽지않음</Badge>
          </Box>
        ),
    },
    {
      field: 'type',
      headerName: '타입',
      renderCell: ({ row }: GridRowData) =>
        row.type === 'seller' ? (
          <Box lineHeight={2}>
            <Badge colorScheme="green">판매자</Badge>
          </Box>
        ) : (
          <Box lineHeight={2}>
            <Badge colorScheme="red">방송인</Badge>
          </Box>
        ),
    },
    { field: 'name', headerName: '이름' },
    {
      field: 'content',
      headerName: '내용',
      minWidth: 400,
      flex: 1,
      renderCell: ({ row }: GridRowData) => (
        <Tooltip label="자세히 보기">
          <Text
            onClick={() => {
              handleOpen(row.id);
            }}
            cursor="pointer"
          >
            {row.content}
          </Text>
        </Tooltip>
      ),
    },
    {
      field: 'createDate',
      headerName: '문의날짜',
      minWidth: 150,
      renderCell: ({ row }: GridRowData) =>
        `${dayjs(row.createDate).format('YYYY/MM/DD HH:mm')}`,
    },
    { field: 'email', headerName: '이메일', minWidth: 200 },
    { field: 'phoneNumber', headerName: '휴대전화', minWidth: 150 },
    {
      field: 'homepage',
      headerName: '홈페이지URL',
      minWidth: 200,
      renderCell: ({ row }: GridRowData) =>
        row.homepage ? (
          <Link href={row.homepage} isExternal>
            {row.homepage} <ExternalLinkIcon mx="2px" />
          </Link>
        ) : (
          ''
        ),
    },
  ];

  return (
    <Box minHeight={{ base: 300, md: 600 }} p={10} mb={24}>
      {data && !isLoading && (
        <>
          <AdminDatagridWrapper>
            <ChakraDataGrid
              width="100%"
              disableExtendRowFullWidth
              autoHeight
              pagination
              autoPageSize
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
              getRowClassName={(params) => {
                // 읽음처리 하지 않은경우
                if (!params.row.readFlag) {
                  return NOT_CHECKED_BY_ADMIN_CLASS_NAME;
                }
                return '';
              }}
            />
          </AdminDatagridWrapper>
          <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalBody>
                <Stack direction="column" p={2} spacing={5}>
                  <Stack direction="row">
                    <Text>문의자</Text>
                    <Text fontWeight="bold">{data[inquiryIndex]?.name}</Text>
                    {data[inquiryIndex]?.type === 'seller' ? (
                      <Badge colorScheme="green">판매자</Badge>
                    ) : (
                      <Badge colorScheme="red">방송인</Badge>
                    )}
                  </Stack>
                  {data[inquiryIndex]?.brandName && (
                    <Stack direction="row">
                      <Text>
                        {data[inquiryIndex].type === 'seller' ? '브랜드명' : '활동플랫폼'}
                      </Text>
                      <Text fontWeight="bold">{data[inquiryIndex]?.brandName}</Text>
                    </Stack>
                  )}

                  {data[inquiryIndex]?.homepage && (
                    <Stack direction="row">
                      <Text>URL</Text>
                      <Link href={data[inquiryIndex].homepage || ''} isExternal>
                        {data[inquiryIndex]?.homepage} <ExternalLinkIcon mx="2px" />
                      </Link>
                    </Stack>
                  )}
                  <Box bgColor="gray.200" p={5} borderRadius={10}>
                    <Text>{data[inquiryIndex]?.content}</Text>
                  </Box>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  닫기
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  );
}

export default InquiryTable;
