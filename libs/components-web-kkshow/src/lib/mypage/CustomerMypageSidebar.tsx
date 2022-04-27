import { Stack, Link, Text } from '@chakra-ui/react';
import { customerMypageNavLinks } from '@project-lc/components-constants/navigation';
import { MypageSidebar } from '@project-lc/components-shared/navbar/MypageSidebar';
import NextLink from 'next/link';

/** 데스크탑 화면에서 사용할 소비자 마이페이지 사이드바(아코디언 형태, active link 표시됨) */
export function CustomerMypageDesktopSidebar(): JSX.Element {
  return <MypageSidebar navLinks={customerMypageNavLinks} />;
}

/** 모바일 화면에서 사용할 소비자 마이페이지 메뉴바 (그냥 링크 목록 형태) */
export function CustomerMypageMobileSidebar(): JSX.Element {
  return (
    <Stack>
      {customerMypageNavLinks.map((main) => (
        <Stack key={main.name}>
          <Text fontWeight="bold">{main.name}</Text>
          <Stack>
            {main.children?.map((child) => (
              <NextLink key={child.name} href={child.href} passHref>
                <Link>{child.name}</Link>
              </NextLink>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
