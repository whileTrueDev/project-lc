import {
  Box,
  BoxProps,
  Divider,
  Flex,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  adminSidebarMenuList,
  SidebarMenuLink,
} from '@project-lc/components-constants/navigation';
import { NavbarToggleButton as AdminSidebarToggleButton } from '@project-lc/components-shared/navbar';
import { motion, Variants } from 'framer-motion';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

export const MotionBox = motion<BoxProps>(Box);

const sidebarVaraints: Variants = {
  open: { width: '200px', opacity: 1 },
  close: { width: '0px', opacity: 0 },
};

export interface SlideSidebarProps {
  isOpen: boolean;
  children?: React.ReactNode;
}
/** open시 슬라이드되는 사이드바(트위치 사이드바와 비슷한 형태)
 * 너비 및 애니메이션은 sidebarVaraints에서 조절
 * @param isOpen : true일때 animate open, false 일때 animate close
 */
export function SlideSidebar({ isOpen, children }: SlideSidebarProps): JSX.Element {
  return (
    <MotionBox
      as="nav"
      position="sticky"
      height="100%"
      top={0}
      initial="open"
      animate={isOpen ? 'open' : 'close'}
      variants={sidebarVaraints}
      // transition={{ bounce: 0 }} // 무슨 타입을 넣으란건지??
    >
      {children}
    </MotionBox>
  );
}

// TODO:  새 페이지 추가하기 쉽게 구성하기
export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

function SidebarMenuLinkItem({ menu }: { menu: SidebarMenuLink }): JSX.Element {
  const router = useRouter();
  const { href, name, children } = menu;

  const match = useMemo(() => router.pathname === href, [href, router.pathname]);

  return (
    // 하위 링크가 있는경우 하위링크 첫번째로 이동
    <NextLink href={children ? children[0].href : href} passHref>
      <Link
        color={useColorModeValue(
          match ? 'red.400' : 'gray.800',
          match ? 'red.300' : 'gray.200',
        )}
        textDecoration={match ? 'underline' : 'none'}
        textDecorationColor={match ? 'red.400' : 'none'}
      >
        {name}
      </Link>
    </NextLink>
  );
}

function SidebarMenuGroup({ menu }: { menu: SidebarMenuLink }): JSX.Element {
  const { children } = menu;

  return (
    <Stack spading={2}>
      <Divider />
      {/* 그룹명 */}
      <Box fontWeight="bold">
        <SidebarMenuLinkItem menu={menu} />
      </Box>
      {/* 그룹내부 하위링크 */}
      {children && (
        <Stack pl={2}>
          {children.map((child) => (
            <SidebarMenuLinkItem key={child.href} menu={child} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps): JSX.Element {
  return (
    <SlideSidebar isOpen={isOpen}>
      <Box borderWidth="1px" p={2}>
        {isOpen && (
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontWeight="extrabold">관리 메뉴</Text>
            <AdminSidebarToggleButton isOpen={isOpen} onToggle={onToggle} />
          </Flex>
        )}

        <Stack>
          {adminSidebarMenuList.map((menu) => (
            <SidebarMenuGroup key={menu.href} menu={menu} />
          ))}
        </Stack>
      </Box>
    </SlideSidebar>
  );
}

export default AdminSidebar;
