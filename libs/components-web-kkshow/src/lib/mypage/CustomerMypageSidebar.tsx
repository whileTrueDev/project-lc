import { ChevronRightIcon } from '@chakra-ui/icons';
import { Stack, Link, Text } from '@chakra-ui/react';
import {
  customerMypageNavLinks,
  MypageLink,
} from '@project-lc/components-constants/navigation';
import { MypageSidebar } from '@project-lc/components-shared/navbar/MypageSidebar';
import NextLink from 'next/link';

/** 데스크탑 화면에서 사용할 소비자 마이페이지 사이드바(아코디언 형태, active link 표시됨) */
export function CustomerMypageDesktopSidebar(): JSX.Element {
  return <MypageSidebar navLinks={customerMypageNavLinks} defaultAllOpen />;
}

/** 모바일 화면에서 사용할 소비자 마이페이지 메뉴바 (그냥 링크 목록 형태) */
export function CustomerMypageMobileSidebar(): JSX.Element {
  return (
    <Stack spacing={4} p={4}>
      {customerMypageNavLinks.map((main) => (
        <Stack key={main.name}>
          <Text fontWeight="bold" textAlign="center">
            {main.name}
          </Text>
          <Stack>
            {main.children?.map((child) => (
              <CustomerMypageMobileSidebarMenuItem key={child.name} item={child} />
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}

function CustomerMypageMobileSidebarMenuItem({
  item,
}: {
  item: Omit<MypageLink, 'icon'>;
}): JSX.Element {
  return (
    <NextLink key={item.name} href={item.href} passHref>
      <Link
        p={2}
        px={4}
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="sm"
        position="relative"
        _hover={{ top: -1, boxShadow: 'md' }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Text>{item.name}</Text>
          <ChevronRightIcon />
        </Stack>
      </Link>
    </NextLink>
  );
}
