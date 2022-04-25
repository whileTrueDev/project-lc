import { Icon } from '@chakra-ui/icons';
import { Box, Center, Flex, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import {
  QuickMenuLink,
  quickMenuLinks,
} from '@project-lc/components-constants/quickMenu';
import { useKkshowSearchStore } from '@project-lc/stores';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import CountBadge from './CountBadge';

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
        minHeight="65px"
        zIndex="docked"
      >
        {quickMenuLinks.map((link) => (
          <BottomQuickMenuItem key={link.name} link={link} />
        ))}
      </Flex>
      <Box h="7vh" display={{ base: 'flex', md: 'none' }} />
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

  // TODO: 장바구니 작업 이후 장바구니 상품 개수 count 데이터 연동 추가 필요 by hwasurr
  const cartItemsCount = useMemo(() => 6, []);

  return (
    <Center w="100%">
      <VStack
        color={isMatched ? 'unset' : 'gray.500'}
        as="button"
        width="80%"
        onClick={onQuickMenuClick}
        spacing={1}
      >
        {link.name === '장바구니' ? (
          <Box pos="relative">
            <CountBadge count={cartItemsCount} top={-2} right={-2} />
            <Icon as={link.icon} width={5} height={5} />
          </Box>
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
