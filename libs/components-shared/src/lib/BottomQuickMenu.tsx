import { VStack, Center, Text, useColorModeValue, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { quickMenuLinks } from '@project-lc/components-constants/quickMenu';
import { Icon } from '@chakra-ui/icons';

export function BottomQuickMenu(): JSX.Element {
  const router = useRouter();
  return (
    <Flex
      display={{ base: 'flex', md: 'none' }}
      justifyContent="space-around"
      position="fixed"
      bottom="0"
      right="0"
      bgColor={useColorModeValue('gray.100', 'gray.700')}
      borderTop="1px solid #d2d2d2"
      width="100%"
      height="10vh"
      zIndex="docked"
    >
      {quickMenuLinks.map((link) =>
        link.type === 'link' ? (
          <Center w="100%" key={link.name}>
            <VStack as="button" width="80%" onClick={() => router.push(link.href || '')}>
              <Icon as={link.icon} width={5} height={5} />
              <Text>{link.name}</Text>
            </VStack>
          </Center>
        ) : (
          <Center w="100%">
            <VStack as="button" width="80%" onClick={link.onClick}>
              <Icon as={link.icon} width={5} height={5} />
              <Text>{link.name}</Text>
            </VStack>
          </Center>
        ),
      )}
    </Flex>
  );
}

export default BottomQuickMenu;
