import { Heading, SimpleGrid, Stack, Text, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useAdminSidebarNotiCounts } from '@project-lc/hooks';
import React from 'react';

const paths: Record<string, { label: string }> = {
  '/broadcaster/settlement-info': { label: '[방송인] 정산정보 검수' },
  '/broadcaster/settlement': { label: '[방송인] 정산' },
  '/seller/account': { label: '[판매자] 계좌정보' },
  '/seller/business-registration': { label: '[판매자] 사업자 등록정보' },
  '/seller/settlement': { label: '[판매자] 정산' },
  '/goods/confirmation': { label: '[상품] 상품목록/검수' },
  '/goods/inquiry': { label: '[상품] 상품문의' },
  '/live-shopping': { label: '[라이브쇼핑] 라이브쇼핑' },
  '/order/list': { label: '[주문] 주문목록' },
  '/order/refund': { label: '[주문] 환불요청' },
  '/general/inquiry': { label: '[일반] 문의' },
};

// 알림초기화 버튼 없어서 관리자가 해당 데이터의 상태를 변경해야 알림개수가 없어짐
const waitingAdminActionPaths = [
  '/goods/confirmation',
  '/goods/inquiry',
  '/order/refund',
  '/general/inquiry',
];

// 알림초기화 버튼 존재. 관리자가 마지막으로 확인한 데이터의 id보다 id값이 큰 데이터가 조회되면 알림개수가 증가함
const newDataNotiPaths = [
  '/broadcaster/settlement-info',
  '/broadcaster/settlement',
  '/seller/account',
  '/seller/business-registration',
  '/seller/settlement',
  '/live-shopping',
  '/order/list',
];

export function AdminMainSummary(): JSX.Element {
  return (
    <Stack spacing={8}>
      <Heading>😄 크크쇼 관리자 페이지에 오신것을 환영합니다 😄</Heading>

      <Stack direction="row" wrap="wrap" gap={10}>
        <Stack>
          <Text fontWeight="bold">관리자의 처리를 기다리는 데이터가 있어요!</Text>
          <NotiCountList pathList={waitingAdminActionPaths} />
        </Stack>

        <Stack>
          <Text fontWeight="bold">
            관리자가 확인하지 않은 새 데이터가 있어요! (알림초기화 버튼 존재)
          </Text>
          <NotiCountList pathList={newDataNotiPaths} />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default AdminMainSummary;

function NotiCountList({ pathList }: { pathList: string[] }): JSX.Element {
  const { data: notiCounts } = useAdminSidebarNotiCounts();
  return (
    <SimpleGrid columns={2} spacing={4} w="md" pl={4}>
      {pathList.map((path) => {
        const count = notiCounts ? notiCounts[path] : 0;
        return (
          <React.Fragment key={path}>
            <Text>{paths[path].label}</Text>
            <NextLink passHref href={path}>
              <Link color={count > 0 ? 'blue.500' : undefined}>{count} 개</Link>
            </NextLink>
          </React.Fragment>
        );
      })}
    </SimpleGrid>
  );
}
