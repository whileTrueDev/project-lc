import { Button, Link, Stack } from '@chakra-ui/react';
import { UserType } from '@prisma/client';
import { useManualLinkPageId } from '@project-lc/hooks';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import MypageBreadcrumb from './MypageBreadCrumb';
import { MypageLayoutProps } from './MypageLayout';

/** 해당 페이지 routerPath에 맞는 이용안내로 이동하는 링크버튼 */
export function ManualLinkButton({
  userType,
}: {
  userType: UserType;
}): JSX.Element | null {
  const router = useRouter();
  const { data: manualId } = useManualLinkPageId({
    routerPath: router.pathname,
    userType,
  });

  if (!manualId) return null;
  return (
    <NextLink href={`/mypage/manual/${manualId}`} passHref>
      <Button as={Link} size="sm" isExternal colorScheme="blue">
        이용안내
      </Button>
    </NextLink>
  );
}

/** 마이페이지 브레드크럼 + 매뉴얼 버튼 포함하는 컴포넌트 */
export function MypageToolbar({
  appType = 'seller',
}: Pick<MypageLayoutProps, 'appType'>): JSX.Element {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <MypageBreadcrumb />
      <ManualLinkButton userType={appType} />
    </Stack>
  );
}
