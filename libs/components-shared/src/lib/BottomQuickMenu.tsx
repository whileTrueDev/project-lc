import { Icon } from '@chakra-ui/icons';
import { Box, Center, Flex, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import {
  QuickMenuLink,
  quickMenuLinks,
} from '@project-lc/components-constants/quickMenu';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

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
      <Box h="7vh" />
    </>
  );
}

interface BottomQuickMenuItemProps {
  link: QuickMenuLink;
}
function BottomQuickMenuItem({ link }: BottomQuickMenuItemProps): JSX.Element {
  const router = useRouter();
  const isMatched = useMemo((): boolean => {
    if (link.type === 'function') return false;
    if (!link.href) return false;
    if (link.href === '/') return router.pathname === link.href;
    return router.pathname.includes(link.href);
  }, [link, router.pathname]);

  const onQuickMenuClick = (): void => {
    if (link.type === 'link') {
      router.push(link.href || '#');
    } else if (link.type === 'function') {
      link.onClick();
    }
  };
  return (
    <Center w="100%">
      <VStack
        color={isMatched ? 'unset' : 'gray.500'}
        as="button"
        width="80%"
        onClick={onQuickMenuClick}
      >
        <Icon as={link.icon} width={5} height={5} />
        <Text fontSize={['sm', 'md']} fontWeight={isMatched ? 'bold' : 'unset'}>
          {link.name}
        </Text>
      </VStack>
    </Center>
  );
}

export default BottomQuickMenu;
