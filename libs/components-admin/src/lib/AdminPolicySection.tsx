import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { GridColumns, GridRowData } from '@material-ui/data-grid';
import { Policy, PolicyCategory, PolicyTarget } from '@prisma/client';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { useAdminPolicyList } from '@project-lc/hooks';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

const POLICY_WRITE_BASE = '/general/policy/write';
function getPolicyWriteUrl(category: PolicyCategory, target: PolicyTarget): string {
  return `${POLICY_WRITE_BASE}/${category}/${target}`;
}

/** 관리자, 운영자를 위한 약관 작성, 수정 시 주의사항 */
export function AdminPolicyCaution(): JSX.Element {
  return (
    <Stack>
      <Alert status="warning">
        <AlertIcon />
        정책 조항이 변경, 삭제, 생성되는 경우에는 &quot;작성&quot; 버튼을 눌러 새로운
        버전을 작성해주세요.
      </Alert>
    </Stack>
  );
}

export function AdminPolicySection(): JSX.Element {
  const policy = useAdminPolicyList();
  const router = useRouter();

  const { termsOfService, privacy } = PolicyCategory;
  const { broadcaster, seller } = PolicyTarget;

  // 작성 페이지로 이동
  const moveToWrite = (category: PolicyCategory, target: PolicyTarget): void => {
    router.push(getPolicyWriteUrl(category, target));
  };
  if (policy.isLoading) {
    return <Spinner />;
  }
  if (policy.isError) {
    return <Text>에러 {JSON.stringify(policy.error)}</Text>;
  }
  if (!policy.data) {
    return (
      <Stack>
        <AdminPolicyCaution />
        <Text>데이터가 없습니다</Text>;
        <Button size="sm" onClick={() => moveToWrite(privacy, broadcaster)}>
          방송인 개인정보처리방침 작성하기
        </Button>
        <Button size="sm" onClick={() => moveToWrite(privacy, seller)}>
          판매자 개인정보처리방침 작성하기
        </Button>
        <Button size="sm" onClick={() => moveToWrite(termsOfService, broadcaster)}>
          방송인 이용약관 작성하기
        </Button>
        <Button size="sm" onClick={() => moveToWrite(termsOfService, seller)}>
          판매자 이용약관 작성하기
        </Button>
      </Stack>
    );
  }

  const filteredData = (
    category: PolicyCategory,
    target: PolicyTarget,
  ): Omit<Policy, 'content'>[] => {
    return policy.data.filter((p) => p.category === category && p.targetUser === target);
  };
  return (
    <Stack spacing={8}>
      <AdminPolicyCaution />
      <Stack>
        <Heading size="lg">개인정보처리방침</Heading>
        <PolicyListContainer
          label="방송인"
          data={filteredData(privacy, broadcaster)}
          onClick={() => moveToWrite(privacy, broadcaster)}
        />
        <PolicyListContainer
          label="판매자"
          data={filteredData(privacy, seller)}
          onClick={() => moveToWrite(privacy, seller)}
        />
      </Stack>

      <Stack>
        <Heading size="lg">이용약관</Heading>
        <PolicyListContainer
          label="방송인"
          data={filteredData(termsOfService, broadcaster)}
          onClick={() => moveToWrite(termsOfService, broadcaster)}
        />
        <PolicyListContainer
          label="판매자"
          data={filteredData(termsOfService, seller)}
          onClick={() => moveToWrite(termsOfService, seller)}
        />
      </Stack>
    </Stack>
  );
}

function PolicyListContainer({
  label,
  data,
  onClick,
}: {
  label: string;
  data: Omit<Policy, 'content'>[];
  onClick: () => any;
}): JSX.Element {
  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <Heading size="sm">{label}</Heading>
        <Button size="sm" onClick={onClick}>
          새로 작성
        </Button>
      </Stack>

      <AdminPolicyList data={data} />
    </Stack>
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
      disableColumnMenu
      disableColumnFilter
      disableSelectionOnClick
    />
  );
}
export default AdminPolicySection;
