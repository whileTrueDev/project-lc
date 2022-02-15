import {
  Box,
  Button,
  Divider,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { Policy } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { useAdminPolicy } from '@project-lc/hooks';
import NextLink from 'next/link';
import dayjs from 'dayjs';

export function AdminPolicySection(): JSX.Element {
  const policy = useAdminPolicy();
  if (policy.isLoading) {
    return <Spinner />;
  }
  if (policy.isError) {
    return <Text>에러 {JSON.stringify(policy.error)}</Text>;
  }
  if (!policy.data) {
    return <Text>데이터가 없습니다, 생성버튼 있어야함</Text>;
  }
  // 방송인 개인정보처리방침
  const broadcasterPrivacyList = policy.data.filter(
    (p) => p.category === 'privacy' && p.targetUser === 'broadcaster',
  );
  // 판매자 개인정보처리방침
  const sellerPrivacyList = policy.data.filter(
    (p) => p.category === 'privacy' && p.targetUser === 'seller',
  );
  // 방송인 이용약관
  const broadcasterTermsOfService = policy.data.filter(
    (p) => p.category === 'termsOfService' && p.targetUser === 'broadcaster',
  );
  // 판매자 이용약관
  const sellerTermsOfService = policy.data.filter(
    (p) => p.category === 'termsOfService' && p.targetUser === 'seller',
  );

  return (
    <Box>
      <Heading size="md">이용약관</Heading>
      <PolicyListContainer label="방송인" data={broadcasterTermsOfService} />
      <PolicyListContainer label="판매자" data={sellerTermsOfService} />

      <Divider />

      <Heading size="md">개인정보처리방침</Heading>
      <PolicyListContainer label="방송인" data={broadcasterPrivacyList} />
      <PolicyListContainer label="판매자" data={sellerPrivacyList} />
    </Box>
  );
}

function PolicyListContainer({
  label,
  data,
}: {
  label: string;
  data: Omit<Policy, 'content'>[];
}): JSX.Element {
  return (
    <Box>
      <Stack direction="row" alignItems="center">
        <Heading size="sm">{label}</Heading>
        <Button size="sm">새로 작성</Button>
      </Stack>

      <AdminPolicyList data={data} />
    </Box>
  );
}

const columns: GridColumns = [
  {
    field: 'id',
    headerName: 'id',
    width: 70,
  },
  {
    field: 'version',
    headerName: '버전',
    width: 200,
    renderCell: ({ row }: GridRowData) => {
      return (
        <NextLink href={`policy/edit/${row.id}`} passHref>
          <Link color="blue.500">{row.version}</Link>
        </NextLink>
      );
    },
  },
  {
    field: 'publicFlag',
    headerName: '공개',
    width: 100,
    renderCell: ({ row }: GridRowData) => {
      return <Text>{row.publicFlag ? '공개' : '비공개'}</Text>;
    },
  },
  {
    field: 'createDate',
    headerName: '생성일',
    width: 150,
    renderCell: ({ row }: GridRowData) => {
      return <Text>{dayjs(row.createDate).format('YYYY/MM/DD HH:mm')}</Text>;
    },
  },
  {
    field: 'updateDate',
    headerName: '수정일',
    width: 150,
    renderCell: ({ row }: GridRowData) => {
      return <Text>{dayjs(row.updateDate).format('YYYY/MM/DD HH:mm')}</Text>;
    },
  },
  {
    field: 'enforcementDate',
    headerName: '시행일',
    width: 150,
    renderCell: ({ row }: GridRowData) => {
      if (row.enforcementDate) {
        return <Text>{dayjs(row.enforcementDate).format('YYYY/MM/DD HH:mm')}</Text>;
      }
      return <Text>-</Text>;
    },
  },
];

function AdminPolicyList({ data }: { data: Omit<Policy, 'content'>[] }): JSX.Element {
  return (
    <ChakraDataGrid
      borderWidth={0}
      hideFooter
      headerHeight={50}
      autoHeight
      density="compact"
      rows={data || []}
      columns={columns}
      rowCount={5}
      rowsPerPageOptions={[25, 50]}
      disableColumnMenu
      disableColumnFilter
      disableSelectionOnClick
    />
  );
}
export default AdminPolicySection;
