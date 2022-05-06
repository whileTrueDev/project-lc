import { Icon } from '@chakra-ui/icons';
import { Box, Center, Flex, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import {
  QuickMenuLink,
  quickMenuLinks,
} from '@project-lc/components-constants/quickMenu';
import { useCart, useProfile } from '@project-lc/hooks';
import { useKkshowSearchStore } from '@project-lc/stores';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import CountBadge from './CountBadge';

export const QUICK_MENU_HEIGHT = '65px';
export function BottomQuickMenu(): JSX.Element {
  return (
    <>
      <Flex
        display={{ base: 'flex', md: 'none' }}
        justifyContent="space-around"
        position="fixed"
        bottom="0"
        right="0"
        bgColor={useColorModeValue('white', 'gray.900')}
        borderTopWidth="thin"
        borderTopColor={useColorModeValue('gray.200', 'gray.700')}
        width="100%"
        height="7vh"
        minHeight={QUICK_MENU_HEIGHT}
        zIndex="docked"
      >
        {quickMenuLinks.map((link) => (
          <BottomQuickMenuItem key={link.name} link={link} />
        ))}
      </Flex>
      <Box h="7vh" minHeight={QUICK_MENU_HEIGHT} display={{ base: 'flex', md: 'none' }} />
    </>
  );
}

interface BottomQuickMenuItemProps {
  link: QuickMenuLink;
}
function BottomQuickMenuItem({ link }: BottomQuickMenuItemProps): JSX.Element {
  const router = useRouter();
  const openSearchDrawer = useKkshowSearchStore((s) => s.openSearchDrawer);
  const isMatched = useMemo((): boolean => {
    if (link.type === 'function') return false;
    if (!link.href) return false;
    if (link.href === '/') return router.pathname === link.href;
    return router.pathname.includes(link.href);
  }, [link, router.pathname]);

  const onQuickMenuClick = (): void => {
    if (link.type === 'link') {
      router.push(link.href || '#');
    } else if (link.name === '검색') {
      if (link.onClick) link.onClick(openSearchDrawer);
    } else if (link.type === 'function') {
      if (link.onClick) link.onClick();
    }
  };

  const profile = useProfile();
  const { data: cartData } = useCart(profile.data?.id);

  return (
    <Center w="100%">
      <VStack
        color={isMatched ? 'unset' : 'gray.500'}
        as="button"
        width="80%"
        onClick={onQuickMenuClick}
        spacing={1}
        position="relative"
      >
        {link.name === '장바구니' ? (
          <>
            <CountBadge count={cartData?.length || 0} right={{ base: 2, sm: 5 }} />
            <Icon as={link.icon} width={5} height={5} />
          </>
        ) : (
          <Icon as={link.icon} width={5} height={5} />
        )}
        <Text
          minW="60px"
          fontSize={['xs', 'sm']}
          fontWeight={isMatched ? 'bold' : 'unset'}
          noOfLines={1}
        >
          {link.name}
        </Text>
      </VStack>
    </Center>
  );
}

export default BottomQuickMenu;
