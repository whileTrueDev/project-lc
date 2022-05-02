import {
  Alert,
  AlertIcon,
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
import { AdminPolicyListRes, useAdminPolicyList } from '@project-lc/hooks';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

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

const categoryList: { key: PolicyCategory; label: string }[] = [
  { key: PolicyCategory.privacy, label: '개인정보처리방침' },
  { key: PolicyCategory.termsOfService, label: '이용약관' },
];
const targetList: { key: PolicyTarget; label: string }[] = [
  { key: PolicyTarget.broadcaster, label: '방송인' },
  { key: PolicyTarget.seller, label: '판매자' },
  { key: PolicyTarget.customer, label: '소비자' },
];

const getFilteredData = (
  data: AdminPolicyListRes,
  category: PolicyCategory,
  target: PolicyTarget,
): AdminPolicyListRes => {
  return data.filter((p) => p.category === category && p.targetUser === target);
};

export function AdminPolicySection(): JSX.Element {
  const policy = useAdminPolicyList();
  const router = useRouter();

  // 작성 페이지로 이동
  const moveToWrite = useCallback(
    (category: PolicyCategory, target: PolicyTarget): void => {
      router.push(getPolicyWriteUrl(category, target));
    },
    [router],
  );

  if (policy.isLoading) {
    return <Spinner />;
  }
  if (policy.isError) {
    return <Text>에러 {JSON.stringify(policy.error)}</Text>;
  }
  if (!policy.data) {
    const buttonData = categoryList.flatMap((cat) => {
      return targetList.map((target) => ({
        key: cat.key + target.key,
        cat,
        target,
      }));
    });
    return (
      <Stack>
        <AdminPolicyCaution />
        <Text>데이터가 없습니다</Text>
        {buttonData.map((button) => (
          <Button
            key={button.key}
            size="sm"
            onClick={() => moveToWrite(button.cat.key, button.target.key)}
          >
            {button.target.label} {button.cat.label} 작성하기
          </Button>
        ))}
      </Stack>
    );
  }

  return (
    <Stack spacing={8}>
      <AdminPolicyCaution />
      {categoryList.map((cat) => {
        return (
          <Stack key={cat.key}>
            <Heading size="lg">{cat.label}</Heading>
            {targetList.map((target) => (
              <PolicyListContainer
                key={target.key}
                label={target.label}
                data={getFilteredData(policy.data, cat.key, target.key)}
                onClick={() => moveToWrite(cat.key, target.key)}
              />
            ))}
          </Stack>
        );
      })}
    </Stack>
  );
}

function PolicyListContainer({
  label,
  data,
  onClick,
}: {
  label: string;
  data: AdminPolicyListRes;
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
