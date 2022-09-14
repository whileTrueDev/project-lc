import {
  Box,
  Divider,
  Flex,
  Icon,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  adminSidebarMenuList,
  SidebarMenuLink,
} from '@project-lc/components-constants/navigation';
import { NavbarToggleButton } from '@project-lc/components-shared/navbar/NavbarToggleButton';
import { CountBadge } from '@project-lc/components-shared/CountBadge';
import { motion, Variants } from 'framer-motion';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { useAdminSidebarNotiCounts } from '@project-lc/hooks';

const sidebarVaraints: Variants = {
  open: { width: '240px', opacity: 1 },
  close: { width: '0px', opacity: 0 },
};

export interface SlideSidebarProps {
  isOpen: boolean;
  children?: React.ReactNode;
}
/** open시 슬라이드되는 사이드바(트위치 사이드바와 비슷한 형태)
 * 너비 및 애니메이션은 sidebarVaraints에서 조절
 * @param isOpen : true일때 animate open, false 일때 animate close
 *
 * Chakra-ui 에서 const MotionBox = motion<BoxProps>(Box); 이런식으로 사용하라는 문서를 봤는데
 * MotionBox를 사용했더니 chakraProps의 transition 타입이 적용되어 framer-motion예제에서와 같이 transition을 사용할 수 없었음
 * 그래서 그냥 motion.nav 사용
 */
export function SlideSidebar({ isOpen, children }: SlideSidebarProps): JSX.Element {
  return (
    <motion.nav
      style={{
        height: '100vh',
        top: 0,
        overflowY: 'auto',
      }}
      initial="open"
      animate={isOpen ? 'open' : 'close'}
      variants={sidebarVaraints}
      transition={{
        opacity: { duration: 0.2, ease: 'easeOut' },
      }}
    >
      {children}
    </motion.nav>
  );
}

export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

function SidebarMenuLinkItem({
  menu,
  count,
}: {
  menu: SidebarMenuLink;
  count?: number;
}): JSX.Element {
  const router = useRouter();
  const { href, name, children, icon } = menu;

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
        <Flex alignItems="center" position="relative">
          {icon && <Icon as={icon} mr={1} />}
          {name}
          {count && <CountBadge count={count} top={1} />}
        </Flex>
      </Link>
    </NextLink>
  );
}

function SidebarMenuGroup({ menu }: { menu: SidebarMenuLink }): JSX.Element {
  const { children } = menu;

  const { data } = useAdminSidebarNotiCounts();

  return (
    <Stack spacing={2}>
      <Divider />
      {/* 그룹명 */}
      <Box fontWeight="bold">
        <SidebarMenuLinkItem menu={menu} />
      </Box>
      {/* 그룹내부 하위링크 */}
      {children && (
        <Stack pl={2}>
          {children.map((child) => (
            <SidebarMenuLinkItem
              key={child.href}
              menu={child}
              count={data?.[child.href] || undefined}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps): JSX.Element {
  return (
    <SlideSidebar isOpen={isOpen}>
      <Box p={2} borderRightWidth="1px" height="inherit">
        {isOpen && (
          <Flex justifyContent="space-between" alignItems="center" pb={2}>
            <Text fontWeight="extrabold">관리 메뉴</Text>
            <NavbarToggleButton isOpen={isOpen} onToggle={onToggle} />
          </Flex>
        )}

        <Stack pb={40}>
          {adminSidebarMenuList.map((menu) => (
            <SidebarMenuGroup key={menu.href} menu={menu} />
          ))}
        </Stack>
      </Box>
    </SlideSidebar>
  );
}

export default AdminSidebar;
